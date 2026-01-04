import { useState } from 'react';
import { RestaurantTable } from '../lib/api';
import { X } from 'lucide-react';

interface BookingFormProps {
  table: RestaurantTable;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  initialTime?: string;
  initialDate?: string;
}

export interface BookingFormData {
  table_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_guests: number;
  booking_date: string;
  booking_time: string;
  special_requests: string;
}

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

// Function to convert 12-hour format back to 24-hour format for submission
const convertTo24HourFormat = (time12: string): string => {
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export default function BookingForm({ table, onClose, onSubmit, initialTime, initialDate }: BookingFormProps) {
  // Convert initial time to 12-hour format for display if it exists
  const initialTime12Hour = initialTime ? convertTo12HourFormat(initialTime) : '';
  
  const [formData, setFormData] = useState<BookingFormData>({
    table_id: table.id,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_guests: 1,
    booking_date: initialDate || new Date().toISOString().split('T')[0],
    booking_time: initialTime || '', // Keep in 24-hour format for submission
    special_requests: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number format (10 digits)
    const phoneDigits = formData.customer_phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'number_of_guests' ? parseInt(value) : value,
    }));
  };

  // Get 12-hour format for display
  const displayTime = formData.booking_time ? convertTo12HourFormat(formData.booking_time) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 booking-form">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#4CAF50] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1B5E20]">
            Book Table {table.table_number}
          </h2>
          <button
            onClick={onClose}
            className="text-[#2E2E2E] hover:text-[#1B5E20] transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-medium text-[#2E2E2E] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] text-sm sm:text-base"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-[#2E2E2E] mb-1">
              Email *
            </label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] text-sm sm:text-base"
              placeholder="Your Email"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-[#2E2E2E] mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={10}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] text-sm sm:text-base"
              placeholder="1234567890"
            />
            <p className="text-xs sm:text-sm text-[#2E2E2E] mt-1">
              Enter exactly 10 digits
            </p>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-[#2E2E2E] mb-1">
              Number of Guests *
            </label>
            <input
              type="number"
              name="number_of_guests"
              value={formData.number_of_guests}
              onChange={handleChange}
              required
              min="1"
              max={table.capacity}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-[#2E2E2E] mt-1">
              Maximum {table.capacity} guests for this table
            </p>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-[#2E2E2E] mb-1">
              Booking Date *
            </label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-[#2E2E2E] mb-1">
              Booking Time *
            </label>
            {initialTime ? (
              // If initialTime is provided, show it in 12-hour format as a non-editable field
              <div className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] rounded-lg bg-gray-100 text-[#2E2E2E]">
                {convertTo12HourFormat(initialTime)}
                <input
                  type="hidden"
                  name="booking_time"
                  value={initialTime} // Keep 24-hour format for submission
                />
              </div>
            ) : (
              // If no initialTime, show the editable select with 12-hour format options
              <select
                name="booking_time"
                value={formData.booking_time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] text-sm sm:text-base"
              >
                <option value="">Choose a time slot</option>
                {/* Time slots from 10 AM to 11 PM in 12-hour format */}
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="21:00">9:00 PM</option>
                <option value="22:00">10:00 PM</option>
                <option value="23:00">11:00 PM</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-[#2E2E2E] mb-1">
              Special Requests
            </label>
            <textarea
              name="special_requests"
              value={formData.special_requests}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] text-sm sm:text-base"
              placeholder="Any dietary restrictions or special requirements..."
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-[#4CAF50] text-[#2E2E2E] rounded-lg hover:bg-[#4CAF50] hover:text-white transition font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-[#1B5E20] text-white rounded-lg hover:bg-[#4CAF50] transition font-medium text-sm sm:text-base"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}