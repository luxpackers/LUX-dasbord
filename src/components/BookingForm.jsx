import { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function BookingForm({ customerId, packages, onAdd }) {
  const [form, setForm] = useState({
    package_code: '',
    booking_date: '',
    trip_start_date: '',
    trip_end_date: '',
    num_passengers: 1,
    passenger_names: [''],
    amount_paid: '',
    amount_remaining: ''
  });

  const handlePassengerChange = (index, value) => {
    const updated = [...form.passenger_names];
    updated[index] = value;
    setForm({ ...form, passenger_names: updated });
  };

  const handleNumPassengers = (value) => {
    const num = parseInt(value, 10) || 1;
    const updated = Array(num).fill('').map((_, i) => form.passenger_names[i] || '');
    setForm({ ...form, num_passengers: num, passenger_names: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('bookings').insert([
      {
        customer_id: customerId,
        package_code: form.package_code,
        booking_date: form.booking_date,
        trip_start_date: form.trip_start_date,
        trip_end_date: form.trip_end_date,
        num_passengers: form.num_passengers,
        passenger_names: form.passenger_names,
        amount_paid: form.amount_paid,
        amount_remaining: form.amount_remaining
      }
    ]);
    if (!error) {
      onAdd();
      setForm({
        package_code: '',
        booking_date: '',
        trip_start_date: '',
        trip_end_date: '',
        num_passengers: 1,
        passenger_names: [''],
        amount_paid: '',
        amount_remaining: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Package & Booking Date */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Package
          </label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={form.package_code}
            onChange={(e) => setForm({ ...form, package_code: e.target.value })}
            required
          >
            <option value="">Select Package</option>
            {packages.map((p) => (
              <option key={p.package_code} value={p.package_code}>
                {p.package_code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Booking Date
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            value={form.booking_date}
            onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Trip Start & End Dates */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trip Start Date
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            value={form.trip_start_date}
            onChange={(e) => setForm({ ...form, trip_start_date: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trip End Date
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            value={form.trip_end_date}
            onChange={(e) => setForm({ ...form, trip_end_date: e.target.value })}
          />
        </div>
      </div>

      {/* Number of Passengers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Passengers
        </label>
        <input
          type="number"
          min="1"
          className="border rounded px-3 py-2 w-full"
          value={form.num_passengers}
          onChange={(e) => handleNumPassengers(e.target.value)}
        />
      </div>

      {/* Passenger Names */}
      {form.passenger_names.map((name, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passenger {index + 1} Name
          </label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={name}
            onChange={(e) => handlePassengerChange(index, e.target.value)}
            required
          />
        </div>
      ))}

      {/* Amount Paid & Remaining */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Paid
          </label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={form.amount_paid}
            onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Remaining
          </label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={form.amount_remaining}
            onChange={(e) => setForm({ ...form, amount_remaining: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Booking
      </button>
    </form>
  );
}
