import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import BookingForm from '../components/BookingForm';
import BookingTable from '../components/BookingTable';

export default function CustomerBookings() {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchPackages();
    fetchCustomer();
  }, [id]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', id);
    setBookings(data || []);
  };

  const fetchPackages = async () => {
    const { data } = await supabase
      .from('packages')
      .select('package_code');
    setPackages(data || []);
  };

  const fetchCustomer = async () => {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    setCustomer(data || null);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 max-w-screen-xl mx-auto">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-gray-800">
        Bookings for <span className="text-primary">{customer?.name || '...'}</span>
      </h2>

      <div className="space-y-6">
        <div className="bg-white p-4 sm:p-6 rounded shadow">
          <BookingForm customerId={id} packages={packages} onAdd={fetchBookings} />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded shadow overflow-x-auto">
          <BookingTable bookings={bookings} packages={packages} onUpdate={fetchBookings} />
        </div>
      </div>
    </div>
  );
}


