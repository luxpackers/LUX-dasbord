import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function BookingTable({ bookings, packages, onUpdate }) {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({});

  const startEdit = (b) => {
    setEditingId(b.booking_id);
    setEdited({
      package_code:    b.package_code,
      booking_date:    b.booking_date,
      trip_start_date: b.trip_start_date || '',
      trip_end_date:   b.trip_end_date || '',
      amount_paid:     b.amount_paid,
      amount_remaining:b.amount_remaining,
      num_passengers:  b.num_passengers,
      passenger_names: b.passenger_names || []
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEdited({});
  };

  const saveEdit = async () => {
    await supabase
      .from('bookings')
      .update(edited)
      .eq('booking_id', editingId);
    cancelEdit();
    onUpdate();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await supabase.from('bookings').delete().eq('booking_id', id);
    onUpdate();
  };

  const updateName = (i, val) => {
    const arr = [...edited.passenger_names];
    arr[i] = val;
    setEdited(e => ({ ...e, passenger_names: arr }));
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[1000px] w-full border bg-white text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                'ID', 'Package', 'Booking Date', 'Trip Start', 'Trip End',
                'Paid', 'Remaining', '# PAX', 'Names', 'Actions'
              ].map((header, i) => (
                <th key={i} className="px-4 py-2 whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.booking_id} className="border-t">
                <td className="px-4 py-2">{b.booking_id}</td>
                <td className="px-4 py-2">{b.package_code}</td>
                <td className="px-4 py-2">{b.booking_date}</td>
                <td className="px-4 py-2">{b.trip_start_date || '—'}</td>
                <td className="px-4 py-2">{b.trip_end_date || '—'}</td>
                <td className="px-4 py-2">{b.amount_paid}</td>
                <td className="px-4 py-2">{b.amount_remaining}</td>
                <td className="px-4 py-2">{b.num_passengers}</td>
                <td className="px-4 py-2">{(b.passenger_names || []).join(', ')}</td>
                <td className="px-4 py-2 flex flex-col sm:flex-row gap-1">
                  <button onClick={() => navigate(`/bookings/${b.booking_id}/flights`)} className="bg-indigo-600 text-white px-2 py-1 rounded">Flights</button>
                  <button onClick={() => navigate(`/bookings/${b.booking_id}/accommodations`)} className="bg-green-600 text-white px-2 py-1 rounded">Accom.</button>
                  <button onClick={() => deleteBooking(b.booking_id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {bookings.map((b) => (
          <div key={b.booking_id} className="border rounded shadow p-4 bg-white">
            <p><strong>ID:</strong> {b.booking_id}</p>
            <p><strong>Package:</strong> {b.package_code}</p>
            <p><strong>Booking Date:</strong> {b.booking_date}</p>
            <p><strong>Trip Start:</strong> {b.trip_start_date || '—'}</p>
            <p><strong>Trip End:</strong> {b.trip_end_date || '—'}</p>
            <p><strong>Paid:</strong> ₹{b.amount_paid}</p>
            <p><strong>Remaining:</strong> ₹{b.amount_remaining}</p>
            <p><strong># Passengers:</strong> {b.num_passengers}</p>
            <p><strong>Names:</strong> {(b.passenger_names || []).join(', ')}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => navigate(`/bookings/${b.booking_id}/flights`)} className="bg-indigo-600 text-white px-3 py-1 rounded">Flights</button>
              <button onClick={() => navigate(`/bookings/${b.booking_id}/accommodations`)} className="bg-green-600 text-white px-3 py-1 rounded">Accom.</button>
              <button onClick={() => deleteBooking(b.booking_id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

