import { RestaurantTable, Booking } from '../lib/api';

// Function to convert 24-hour format to 12-hour format
const convertTo12HourFormat = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  let period = 'AM';
  let hour = hours;

  if (hour >= 12) {
    period = 'PM';
    if (hour > 12) {
      hour = hour - 12;
    }
  }
  if (hour === 0) {
    hour = 12;
  }

  return `${hour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

interface TableGridProps {
  tables: RestaurantTable[];
  bookings: Booking[];
  selectedDate: string;
  onTableSelect: (table: RestaurantTable, timeSlot: string) => void;
}

export default function TableGrid({ tables, bookings, selectedDate, onTableSelect }: TableGridProps) {
  // Define all time slots in 24-hour format for internal use
  const TIME_SLOTS_24H = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  
  // Check if a time slot is booked for a specific table
  const isTimeSlotBooked = (tableId: string, timeSlot: string) => {
    return bookings.some(booking => 
      booking.table_id === tableId && 
      booking.booking_date === selectedDate && 
      booking.booking_time === timeSlot &&
      booking.status !== 'completed'
    );
  };
  
  // Check if a table has any available time slots
  const hasAvailableSlots = (tableId: string) => {
    return TIME_SLOTS_24H.some(timeSlot => !isTimeSlotBooked(tableId, timeSlot));
  };

  return (
    <div className="space-y-6 table-grid">
      {tables.map((table) => {
        const available = hasAvailableSlots(table.id);
        
        return (
          <div key={table.id} className="card border border-primary-200 hover:border-primary-300 transition-colors duration-300">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">Table {table.table_number}</h3>
                  <span className={`badge ${available ? 'badge-primary' : 'badge-secondary'}`}>
                    {available ? 'Available' : 'Fully Booked'}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {table.capacity} seats
                </p>
                {available && (
                  <p className="text-xs text-primary-600 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Click time slot to book
                  </p>
                )}
              </div>
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-3 rounded-xl">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {TIME_SLOTS_24H.map(timeSlot => {
                const booked = isTimeSlotBooked(table.id, timeSlot);
                const isAvailable = available && !booked;
                
                return (
                  <div
                    key={`${table.id}-${timeSlot}`}
                    onClick={() => isAvailable && onTableSelect(table, timeSlot)}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer transform hover:scale-105 ${
                      booked 
                        ? 'table-slot-booked' 
                        : isAvailable 
                          ? 'table-slot-available hover:shadow-elegant' 
                          : 'table-slot-unavailable'
                    }`}
                  >
                    <div className="text-sm sm:text-base font-bold mb-1">{convertTo12HourFormat(timeSlot)}</div>
                    <div className={`text-xs font-medium ${
                      booked ? 'text-red-700' : isAvailable ? 'text-green-700' : 'text-neutral-500'
                    }`}>
                      {booked ? 'Booked' : isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                    {isAvailable && (
                      <div className="mt-1">
                        <svg className="w-4 h-4 mx-auto text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}