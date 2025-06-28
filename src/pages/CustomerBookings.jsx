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
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', id);
    if (!error) setBookings(data);
  };

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('packages')
      .select('package_code')
      .neq('package_code', null);
    if (!error) setPackages(data);
  };

  const fetchCustomer = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    if (!error) setCustomer(data);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Bookings for {customer?.name || '...'}
      </h2>

      <BookingForm customerId={id} packages={packages} onAdd={fetchBookings} />
      <BookingTable bookings={bookings} packages={packages} onUpdate={fetchBookings} />
    </div>
  );
}
