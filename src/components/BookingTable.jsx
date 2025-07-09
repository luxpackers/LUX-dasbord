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
    <div className="overflow-x-auto">
      <table className="min-w-[1000px] w-full border bg-white text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Package</th>
            <th className="px-4 py-2">Booking Date</th>
            <th className="px-4 py-2">Trip Start</th>
            <th className="px-4 py-2">Trip End</th>
            <th className="px-4 py-2">Paid</th>
            <th className="px-4 py-2">Remaining</th>
            <th className="px-4 py-2"># PAX</th>
            <th className="px-4 py-2">Names</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.booking_id} className="border-t">
              {/* ID */}
              <td className="px-4 py-2">{b.booking_id}</td>

              {/* Package */}
              <td className="px-4 py-2">
                {editingId === b.booking_id ? (
                  <select
                    className="border p-1 rounded w-full"
                    value={edited.package_code}
                    onChange={e => setEdited({ ...edited, package_code: e.target.value })}
                  >
                    <option value="">—</option>
                    {packages.map(p => (
                      <option key={p.package_code} value={p.package_code}>
                        {p.package_code}
                      </option>
                    ))}
                  </select>
                ) : b.package_code}
              </td>

              {/* Booking Date */}
              <td className="px-4 py-2">
                {editingId === b.booking_id ? (
                  <input
                    type="date"
                    className="border p-1 rounded w-full"
                    value={edited.booking_date || ''}
                    onChange={e => setEdited({ ...edited, booking_date: e.target.value })}
                  />
                ) : b.booking_date}
              </td>

              {/* Trip Start */}
              <td className="px-4 py-2">
                {editingId === b.booking_id ? (
                  <input
                    type="date"
                    className="border p-1 rounded w-full"
                    value={edited.trip_start_date}
                    onChange={e => setEdited({ ...edited, trip_start_date: e.target.value })}
                  />
                ) : (b.trip_start_date || '—')}
              </td>

              {/* Trip End */}
              <td className="px-4 py-2">
                {editingId === b.booking_id ? (
                  <input
                    type="date"
                    className="border p-1 rounded w-full"
                    value={edited.trip_end_date}
                    onChange={e => setEdited({ ...edited, trip_end_date: e.target.value })}
                  />
                ) : (b.trip_end_date || '—')}
              </td>

              {/* Amount Paid */}
              <td className="px-4 py-2">
                {editingId === b.booking_id ? (
                  <input
                    type="number"
                    className="border p-1 rounded w-full"
                    value={edited.amount_paid}
                    onChange={e => setEdited({ ...edited, amount_paid: +e.target.value })}
                  />
                ) : b.amount_paid}
              </td>

              {/* Amount Remaining */}
              <td className="px-4 py-2">
                {editingId === b.booking_id ? (
                  <input
                    type="number"
                    className="border p-1 rounded w-full"
                    value={edited.amount_remaining}
                    onChange={e => setEdited({ ...edited, amount_remaining: +e.target.value })}
                  />
                ) : b.amount_remaining}
              </td>

              {/* Num Passengers */}
              <td className="px-4 py-2">
                {editingId === b.booking_id ? (
                  <input
                    type="number"
                    min="1"
                    className="border p-1 rounded w-full"
                    value={edited.num_passengers}
                    onChange={e => {
                      const n = +e.target.value || 1;
                      const arr = [...edited.passenger_names];
                      arr.length = n;
                      setEdited({ ...edited, num_passengers: n, passenger_names: arr });
                    }}
                  />
                ) : b.num_passengers}
              </td>

              {/* Passenger Names */}
              <td className="px-4 py-2">
                {editingId === b.booking_id ? (
                  <div className="space-y-1">
                    {edited.passenger_names.map((n, i) => (
                      <input
                        key={i}
                        type="text"
                        className="border p-1 rounded w-full"
                        placeholder={`P${i + 1}`}
                        value={n}
                        onChange={e => updateName(i, e.target.value)}
                      />
                    ))}
                  </div>
                ) : (b.passenger_names || []).join(', ')}
              </td>

              {/* Actions */}
              <td className="px-4 py-2 flex flex-col sm:flex-row gap-1">
                {editingId === b.booking_id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(b)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBooking(b.booking_id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/bookings/${b.booking_id}/flights`)}
                      className="bg-indigo-600 text-white px-2 py-1 rounded"
                    >
                      Flights
                    </button>
                    <button
                      onClick={() => navigate(`/bookings/${b.booking_id}/accommodations`)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Accom.
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

