import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setCustomers(data);
    }
  };

  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase.from('customers').insert([newCustomer]);
    if (error) {
      console.error('Insert error:', error.message);
      alert('Could not add customer');
    } else {
      setNewCustomer({ name: '', email: '', phone: '' });
      fetchCustomers();
    }
  };

  const startEdit = (customer) => {
    setEditingId(customer.id);
    setEditData({ name: customer.name, email: customer.email, phone: customer.phone });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', email: '', phone: '' });
  };

  const updateCustomer = async (id) => {
    const { error } = await supabase.from('customers').update(editData).eq('id', id);
    if (error) {
      console.error('Update error:', error.message);
      alert('Could not update customer');
    } else {
      cancelEdit();
      fetchCustomers();
    }
  };

  const deleteCustomer = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this customer?");
    if (!confirm) return;

    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
      console.error('Delete error:', error.message);
      alert('Could not delete customer');
    } else {
      fetchCustomers();
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-screen-lg mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Customers</h1>

      {/* Form */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Name"
          value={newCustomer.name}
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Email"
          value={newCustomer.email}
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Phone"
          value={newCustomer.phone}
          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
        />
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={addCustomer}
        >
          Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                {editingId === c.id ? (
                  <>
                    <td className="py-2 px-4">
                      <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="border p-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4">
                      <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="border p-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4">
                      <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="border p-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4 flex flex-wrap gap-2">
                      <button onClick={() => updateCustomer(c.id)} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4">{c.name}</td>
                    <td className="py-2 px-4">{c.email}</td>
                    <td className="py-2 px-4">{c.phone}</td>
                    <td className="py-2 px-4 flex flex-wrap gap-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => navigate(`/customers/${c.id}/bookings`)}
                      >
                        View
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => deleteCustomer(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
