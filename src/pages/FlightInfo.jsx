import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function FlightInfo() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [flights, setFlights] = useState([]);
  const [form, setForm] = useState({
    flight_date: '',
    flight_no: '',
    origin: '',
    destination: '',
    dep_time: '',
    arr_time: '',
    arr_day_offset: 0
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('flights')
        .select('*')
        .eq('booking_id', bookingId)
        .order('flight_date', { ascending: true });
      setFlights(data || []);
    })();
  }, [bookingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const addFlight = async (e) => {
    e.preventDefault();
    const payload = {
      booking_id: bookingId,
      ...form,
      arr_day_offset: parseInt(form.arr_day_offset) || 0
    };
    const { error } = await supabase.from('flights').insert([payload]);
    if (!error) {
      setForm({
        flight_date: '',
        flight_no: '',
        origin: '',
        destination: '',
        dep_time: '',
        arr_time: '',
        arr_day_offset: 0
      });
      const { data } = await supabase
        .from('flights')
        .select('*')
        .eq('booking_id', bookingId)
        .order('flight_date', { ascending: true });
      setFlights(data || []);
    }
  };

  const deleteFlight = async (id) => {
    if (!window.confirm('Delete this flight?')) return;
    await supabase.from('flights').delete().eq('id', id);
    setFlights((f) => f.filter((x) => x.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-indigo-600 hover:underline text-sm"
      >
        ← Back to Bookings
      </button>

      <h2 className="text-xl sm:text-2xl font-bold mb-4">Flight Details</h2>

      {/* Flight Form */}
      <form onSubmit={addFlight} className="grid gap-4 bg-white p-4 rounded shadow">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="flight_date"
              value={form.flight_date}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Flight No</label>
            <input
              type="text"
              name="flight_no"
              value={form.flight_no}
              onChange={handleChange}
              placeholder="e.g. SQ 505"
              className="border rounded px-2 py-1 w-full text-sm"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Origin (IATA)</label>
            <input
              type="text"
              name="origin"
              value={form.origin}
              onChange={handleChange}
              placeholder="e.g. AMD"
              className="border rounded px-2 py-1 w-full text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Destination (IATA)</label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="e.g. SIN"
              className="border rounded px-2 py-1 w-full text-sm"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Departure Time</label>
            <input
              type="time"
              name="dep_time"
              value={form.dep_time}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Arrival Time</label>
            <input
              type="time"
              name="arr_time"
              value={form.arr_time}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">+Days</label>
            <input
              type="number"
              name="arr_day_offset"
              min="0"
              value={form.arr_day_offset}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
        >
          Add Flight
        </button>
      </form>

      {/* Responsive Table */}
      <div className="mt-6 overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-xs sm:text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Flight</th>
              <th className="px-4 py-2 text-left">Route</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="px-4 py-2">
                  {new Date(f.flight_date).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-4 py-2">{f.flight_no}</td>
                <td className="px-4 py-2">
                  {f.origin} → {f.destination}
                </td>
                <td className="px-4 py-2">
                  {f.dep_time.slice(0, 5)} → {f.arr_time.slice(0, 5)}
                  {f.arr_day_offset > 0 && ` (+${f.arr_day_offset})`}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteFlight(f.id)}
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


