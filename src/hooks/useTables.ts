// ============================================
// FILE: hooks/useTables.ts - WITH SMART REFRESH
// ============================================
import { useState, useEffect, useRef } from 'react';
import { tablesApi, RestaurantTable, HttpError } from '../lib/api';
import { toast } from 'react-toastify';

export const useTables = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshInterval = 10000; // 10 seconds

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tablesApi.getAll();
      setTables(data);
    } catch (err: any) {
      console.error('❌ Error fetching tables:', err);
      
      // If it's an auth error, stop the auto-refresh to prevent continuous errors
      if (err instanceof HttpError && err.status === 401) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      
      setError(err instanceof Error ? err.message : 'Failed to fetch tables');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createTable = async (tableData: { table_number: string; capacity: number }) => {
    try {
      setIsLoading(true);
      setError(null);
      await tablesApi.create({ ...tableData, status: 'available' });
      await fetchTables(); // Refresh after creating
      toast.success('Table created successfully!');
    } catch (err) {
      // Log error for debugging
      console.error('❌ Error creating table:', err);
      setError(err instanceof Error ? err.message : 'Failed to create table');
      toast.error('Failed to create table');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await tablesApi.delete(id);
      await fetchTables(); // Refresh after deleting
      toast.success('Table deleted successfully!');
    } catch (err) {
      // Log error for debugging
      console.error('❌ Error deleting table:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete table');
      toast.error('Failed to delete table');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
        fetchTables(); // Immediate refresh when returning
        intervalRef.current = setInterval(fetchTables, refreshInterval);
      }
    };

    // Initial setup
    fetchTables(); // Fetch immediately
    intervalRef.current = setInterval(fetchTables, refreshInterval);
    
    // Register visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Run once on mount

  return {
    tables,
    isLoading,
    error,
    fetchTables, // Manual refresh still available
    createTable,
    deleteTable
  };
};