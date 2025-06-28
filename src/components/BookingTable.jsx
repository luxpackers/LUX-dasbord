import supabase from '../lib/supabaseClient';

export default function BookingTable({ bookings, packages, onUpdate }) {
  const updateBooking = async (id, update) => {
    const { error } = await supabase
      .from('bookings')
      .update(update)
      .eq('booking_id', id);
    if (!error) onUpdate();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('booking_id', id);
    if (!error) onUpdate();
  };

  return (
    <table className="min-w-full border bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4">Booking ID</th>
          <th className="py-2 px-4">Package</th>
          <th className="py-2 px-4">Date</th>
          <th className="py-2 px-4">Paid</th>
          <th className="py-2 px-4">Remaining</th>
          <th className="py-2 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.booking_id} className="border-t">
            <td className="py-2 px-4">{b.booking_id}</td>
            <td className="py-2 px-4">
              <select
                value={b.package_code}
                onChange={(e) => updateBooking(b.booking_id, { package_code: e.target.value })}
                className="border p-1 rounded"
              >
                <option value="">Select</option>
                {packages.map(p => (
                  <option key={p.package_code} value={p.package_code}>
                    {p.package_code}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-2 px-4">
              <input
                type="date"
                value={b.booking_date || ''}
                onChange={(e) => updateBooking(b.booking_id, { booking_date: e.target.value })}
                className="border p-1 rounded"
              />
            </td>
            <td className="py-2 px-4">
              <input
                type="number"
                value={b.amount_paid}
                onChange={(e) => updateBooking(b.booking_id, { amount_paid: Number(e.target.value) })}
                className="border p-1 rounded w-24"
              />
            </td>
            <td className="py-2 px-4">
              <input
                type="number"
                value={b.amount_remaining}
                onChange={(e) => updateBooking(b.booking_id, { amount_remaining: Number(e.target.value) })}
                className="border p-1 rounded w-24"
              />
            </td>
            <td className="py-2 px-4">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteBooking(b.booking_id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
