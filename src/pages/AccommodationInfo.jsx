import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function AccommodationInfo() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    hotel_name: '',
    address: '',
    room_type: '',
    nights: '',
    confirmation_no: ''
  });

  // Fetch existing accommodations
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('accommodations')
        .select('*')
        .eq('booking_id', bookingId)
        .order('start_date', { ascending: true });
      setList(data || []);
    })();
  }, [bookingId]);

  // Handler to update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Add a new accommodation
  const addAccommodation = async (e) => {
    e.preventDefault();
    const payload = { booking_id: bookingId, ...form };
    const { error } = await supabase.from('accommodations').insert([payload]);
    if (!error) {
      // clear form
      setForm({
        start_date: '',
        end_date: '',
        hotel_name: '',
        address: '',
        room_type: '',
        nights: '',
        confirmation_no: ''
      });
      // refresh list
      const { data } = await supabase
        .from('accommodations')
        .select('*')
        .eq('booking_id', bookingId)
        .order('start_date', { ascending: true });
      setList(data || []);
    }
  };

  // Delete handler (single declaration)
  const deleteOne = async (id) => {
    if (!window.confirm('Delete this accommodation?')) return;
    await supabase.from('accommodations').delete().eq('id', id);
    setList((l) => l.filter((x) => x.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Back to Bookings
      </button>
      <h2 className="text-2xl font-bold mb-4">Accommodation Details</h2>

      {/* Form */}
      <form
        onSubmit={addAccommodation}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Hotel Name & Address
          </label>
          <input
            type="text"
            name="hotel_name"
            placeholder="Hotel & name"
            value={form.hotel_name}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full mb-2"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address details"
            value={form.address}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <input
              type="text"
              name="room_type"
              placeholder="e.g. OWN BOOKED"
              value={form.room_type}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nights</label>
            <input
              type="text"
              name="nights"
              placeholder="e.g. 3N"
              value={form.nights}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirmation #</label>
            <input
              type="text"
              name="confirmation_no"
              placeholder="e.g. OWN BOOKED"
              value={form.confirmation_no}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Accommodation
        </button>
      </form>

      {/* Table */}
      <div className="mt-6 overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Period</th>
              <th className="px-4 py-2">Hotel & Address</th>
              <th className="px-4 py-2">Room Type</th>
              <th className="px-4 py-2">Nights</th>
              <th className="px-4 py-2">Confirmation #</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-2">
                  {new Date(a.start_date).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short'
                  })}{' '}
                  –{' '}
                  {new Date(a.end_date).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-4 py-2">
                  <div className="font-medium">{a.hotel_name}</div>
                  <div className="text-gray-600 text-sm">{a.address}</div>
                </td>
                <td className="px-4 py-2">{a.room_type}</td>
                <td className="px-4 py-2">{a.nights}</td>
                <td className="px-4 py-2">{a.confirmation_no || '—'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteOne(a.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

