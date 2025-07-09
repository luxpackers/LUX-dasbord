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

  // Fetch existing flights
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Add new flight
  const addFlight = async (e) => {
    e.preventDefault();
    const payload = {
      booking_id: bookingId,
      flight_date: form.flight_date,
      flight_no: form.flight_no,
      origin: form.origin,
      destination: form.destination,
      dep_time: form.dep_time,
      arr_time: form.arr_time,
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
      // Refresh list
      const { data } = await supabase
        .from('flights')
        .select('*')
        .eq('booking_id', bookingId)
        .order('flight_date', { ascending: true });
      setFlights(data || []);
    }
  };

  // Delete flight
  const deleteFlight = async (id) => {
    if (!window.confirm('Delete this flight?')) return;
    await supabase.from('flights').delete().eq('id', id);
    setFlights((f) => f.filter((x) => x.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Back to Bookings
      </button>
      <h2 className="text-2xl font-bold mb-4">Flight Details</h2>

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
              className="border rounded px-2 py-1 w-full"
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
              className="border rounded px-2 py-1 w-full"
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
              className="border rounded px-2 py-1 w-full"
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
              className="border rounded px-2 py-1 w-full"
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
              className="border rounded px-2 py-1 w-full"
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
              className="border rounded px-2 py-1 w-full"
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
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Flight
        </button>
      </form>

      {/* Flights Table */}
      <div className="mt-6 overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Flight</th>
              <th className="px-4 py-2">Route</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="px-4 py-2">
                  {new Date(f.flight_date).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-4 py-2">{f.flight_no}</td>
                <td className="px-4 py-2">
                  {f.origin} → {f.destination}
                </td>
                <td className="px-4 py-2">
                  DEP: {f.dep_time.slice(0, 5)} → ARR: {f.arr_time.slice(0, 5)}
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
