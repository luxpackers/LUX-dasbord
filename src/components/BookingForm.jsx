import { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function BookingForm({ customerId, packages, onAdd }) {
  const [form, setForm] = useState({
    package_code: '',
    booking_date: '',
    amount_paid: '',
    amount_remaining: ''
  });

  const handleAdd = async () => {
    const { package_code, booking_date, amount_paid, amount_remaining } = form;
    if (!package_code || !booking_date) {
      alert('Fill all fields');
      return;
    }

    const { error } = await supabase.from('bookings').insert([{
      customer_id: customerId,
      package_code,
      booking_date,
      amount_paid: Number(amount_paid),
      amount_remaining: Number(amount_remaining)
    }]);

    if (!error) {
      setForm({ package_code: '', booking_date: '', amount_paid: '', amount_remaining: '' });
      onAdd();
    } else {
      alert('Add failed');
      console.error(error.message);
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      <select
        className="border p-2 rounded w-1/5"
        value={form.package_code}
        onChange={(e) => setForm({ ...form, package_code: e.target.value })}
      >
        <option value="">Select Package</option>
        {packages.map(p => (
          <option key={p.package_code} value={p.package_code}>
            {p.package_code}
          </option>
        ))}
      </select>
      <input
        type="date"
        className="border p-2 rounded w-1/5"
        value={form.booking_date}
        onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
      />
      <input
        className="border p-2 rounded w-1/5"
        placeholder="Paid"
        value={form.amount_paid}
        onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
      />
      <input
        className="border p-2 rounded w-1/5"
        placeholder="Remaining"
        value={form.amount_remaining}
        onChange={(e) => setForm({ ...form, amount_remaining: e.target.value })}
      />
      <button className="bg-green-600 text-white px-4 rounded" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}
