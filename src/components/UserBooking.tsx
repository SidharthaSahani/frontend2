import { useState, useEffect } from 'react';
import { tablesApi, bookingsApi, RestaurantTable, Booking, API_BASE_URL } from '../lib/api';
import { carouselService, type CarouselImage } from '../services/carouselService';
import TableGrid from './TableGrid';
import BookingForm, { BookingFormData } from './BookingForm';
import FoodMenu from './FoodMenu';
import Carousel from './Carousel';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function UserBooking() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
    fetchBookings();
    fetchCarouselImages();
    // For our API, we'll poll for changes every 30 seconds
    const interval = setInterval(() => {
      fetchTables();
      fetchBookings();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedDate]);

  const fetchTables = async () => {
    try {
      const data = await tablesApi.getAll();
      setTables(data);
    } catch (error) {
      toast.error('Failed to load tables. Please refresh the page.');
    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (error: any) {
      // Only show error if it's not a 401 Unauthorized (for non-admin users)
      if (error.status !== 401) {
        toast.error('Failed to load bookings. Some availability information may be outdated.');
      }
      // For 401 errors, we silently handle them since non-admins can't access bookings API
    }
  };

  const fetchCarouselImages = async () => {
    try {
      const images = await carouselService.getImages();
      // Validate that images is an array before setting
      if (Array.isArray(images) && images.length > 0) {
        setCarouselImages(images);
      } else {
        // Fallback to sample images if no images found
        setCarouselImages([
          { id: '', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: '' },
          { id: '', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: '' },
          { id: '', url: 'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: '' },
          { id: '', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: '' }
        ]);
      }
    } catch (error) {
      toast.warn('Failed to load carousel images. Using default images.');
      // Fallback to sample images if API fails
      setCarouselImages([
        { id: '', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: '' },
        { id: '', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: '' },
        { id: '', url: 'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: '' },
        { id: '', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: '' }
      ]);
    }
  };

  const handleTableSelect = (table: RestaurantTable, timeSlot: string) => {
    setSelectedTable(table);
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    try {
      // Add the booking
      await bookingsApi.create(bookingData);
      
      // Refresh bookings immediately to prevent race conditions
      await fetchBookings();
      
      setSelectedTable(null);
      setSelectedTimeSlot('');
      toast.success('Booking confirmed! Your table has been successfully reserved.');
    } catch (error: any) {
      // Handle conflict error (time slot already booked)
      if (error.status === 409) {
        toast.error('This time slot is already booked for the selected table. Please choose a different time slot.');
        // Refresh bookings to show the current state
        await fetchBookings();
      } else {
        toast.error('Failed to submit booking. Please try again.');
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 customer-booking max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mb-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mb-2">Reserve Your Table</h1>
        <p className="text-neutral-600 text-sm max-w-xl mx-auto">Select an available table and time slot to make your reservation</p>
      </div>

      {/* Carousel Section */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl">
          <Carousel images={carouselImages} />
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-elegant animate-pulse">
          <div className="flex-shrink-0">
            <CheckCircle2 className="text-green-600" size={24} />
          </div>
          <div>
            <p className="font-semibold text-green-800 text-base sm:text-lg">Booking Confirmed!</p>
            <p className="text-sm text-green-700">Your table has been successfully reserved.</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Select Date</label>
          <div className="relative max-w-md">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="input-field pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-neutral-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs font-medium text-neutral-700">Booked</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-neutral-600">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4 animate-pulse">
              <svg className="w-6 h-6 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-neutral-600">Loading tables...</p>
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-neutral-600">No tables available at the moment. Please check back later.</p>
          </div>
        ) : (
          <TableGrid 
            tables={tables} 
            bookings={bookings}
            selectedDate={selectedDate}
            onTableSelect={handleTableSelect} 
          />
        )}
      </div>

      <FoodMenu />

      {selectedTable && selectedTimeSlot && (
        <BookingForm
          table={selectedTable}
          onClose={() => {
            setSelectedTable(null);
            setSelectedTimeSlot('');
          }}
          onSubmit={handleBookingSubmit}
          initialTime={selectedTimeSlot}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
}