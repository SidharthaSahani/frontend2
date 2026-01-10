// ============================================
// FILE: hooks/useBookings.ts - WITH SMART REFRESH
// ============================================
import { useState, useEffect, useMemo, useRef } from 'react';
import { bookingsApi, Booking, HttpError } from '../lib/api';
import { toast } from 'react-toastify';

export const useBookings = (selectedDate: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshInterval = 10000; // 10 seconds

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (err: any) {
      console.error('❌ Error fetching bookings:', err);
      
      // If it's an auth error, stop the auto-refresh to prevent continuous errors
      if (err instanceof HttpError && err.status === 401) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const releaseBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await bookingsApi.update(bookingId, { status: 'completed' });
      await fetchBookings(); // Refresh after updating
      toast.success('Booking released successfully!');
    } catch (err) {
      // Log error for debugging
      console.error('❌ Error releasing booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to release booking');
      toast.error('Failed to release booking');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Filter bookings by selected date
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const bookingDate = booking.booking_date;
      return bookingDate === selectedDate;
    });
  }, [bookings, selectedDate]);

  // Smart Refresh: Pause when tab hidden, resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden - pause auto-refresh
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Tab visible - resume auto-refresh
        fetchBookings(); // Immediate refresh when returning
        intervalRef.current = setInterval(fetchBookings, refreshInterval);
      }
    };

    // Initial setup
    fetchBookings(); // Fetch immediately
    intervalRef.current = setInterval(fetchBookings, refreshInterval);
    
    // Register visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount or when selectedDate changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedDate]); // Re-run when date changes

  return {
    bookings,
    filteredBookings,
    isLoading,
    error,
    fetchBookings, // Manual refresh still available
    releaseBooking
  };
};