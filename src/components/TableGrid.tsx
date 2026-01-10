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
          <div key={table.id} className="bg-white rounded-lg shadow p-4 sm:p-6 border border-[#4CAF50]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1B5E20]">Table {table.table_number}</h3>
                <p className="text-sm text-[#2E2E2E]">{table.capacity} seats</p>
                <p className="text-xs text-[#4CAF50] mt-1">click at time slot to book table</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {TIME_SLOTS_24H.map(timeSlot => {
                const booked = isTimeSlotBooked(table.id, timeSlot);
                return (
                  <div
                    key={`${table.id}-${timeSlot}`}
                    onClick={() => !booked && available && onTableSelect(table, timeSlot)}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer ${
                      booked 
                        ? 'bg-red-500/20 border-red-500 text-red-700 cursor-not-allowed opacity-75' 
                        : available 
                          ? 'bg-green-500/20 border-green-500 text-green-700 hover:bg-green-500/30' 
                          : 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={booked ? {} : {}}
                  >
                    <div className="text-sm sm:text-base font-bold">{convertTo12HourFormat(timeSlot)}</div>
                    <div className="text-xs mt-1">{booked ? 'Booked' : 'Available'}</div>
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