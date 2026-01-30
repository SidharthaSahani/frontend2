// ============================================
// FILE: components/admin/AdminPanel.tsx (Main Component)
// ============================================
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTables } from '../../hooks/useTables';
import { useBookings } from '../../hooks/useBookings';
import { CarouselManagement } from './CarouselManagement';
import { TablesManagement } from './TablesManagement';
import { BookingsTable } from './BookingsTable';
import FoodManagement from '../FoodManagement';

export default function AdminPanel() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const { fetchTables } = useTables();
  const { fetchBookings } = useBookings(selectedDate);

  const handleRefreshAll = async () => {
    try {
      await fetchTables();
      await fetchBookings();
    } catch (error) {

    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div className="admin-card admin-table-header">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.548-.99 3.192-.99 4.741 0 1.549.99 1.549 2.607 0 3.606-1.452 1.001-2.904 1.001-4.356 0-1.452-1.001-2.904-1.001-4.356 0-1.452 1.001-2.904 1.001-4.356 0-1.549-.99-1.549-2.607 0-3.606a1.724 1.724 0 002.573-1.066z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">Admin Panel</h2>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="admin-input pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleRefreshAll}
              className="admin-btn-primary flex items-center gap-2 text-sm sm:text-base"
            >
              <RefreshCw size={18} className="animate-spin-once" />
              Refresh All
            </button>
          </div>
        </div>
      </div>

      <CarouselManagement />
      <TablesManagement selectedDate={selectedDate} />
      <BookingsTable selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <FoodManagement />
    </div>
  );
}