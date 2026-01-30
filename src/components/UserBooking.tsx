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
    <div className="p-4 sm:p-6 space-y-6 customer-booking">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1B5E20] mb-2">Reserve Your Table</h1>
        <p className="text-[#2E2E2E] text-sm sm:text-base">Select an available table and time slot to make your reservation</p>
      </div>

      {/* Carousel Section */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl">
          <Carousel images={carouselImages} />
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 sm:p-4 flex items-center gap-3 animate-pulse">
          <CheckCircle2 className="text-green-600" size={20} />
          <div>
            <p className="font-semibold text-green-800 text-sm sm:text-base">Booking Confirmed!</p>
            <p className="text-sm text-green-700">Your table has been successfully reserved.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="px-3 py-2 border border-[#4CAF50] rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20] sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#4CAF50]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#4CAF50] rounded"></div>
            <span className="text-xs sm:text-sm font-medium text-[#2E2E2E]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
            <span className="text-xs sm:text-sm font-medium text-[#2E2E2E]">Booked</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12 text-[#2E2E2E] text-sm sm:text-base">Loading tables...</div>
        ) : tables.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-[#2E2E2E] text-sm sm:text-base">
            No tables available at the moment. Please check back later.
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