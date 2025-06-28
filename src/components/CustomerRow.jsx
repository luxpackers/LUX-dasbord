import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function CustomerRow({ customer, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(customer);
  const navigate = useNavigate();

  const saveEdit = async () => {
    const { error } = await supabase
      .from('customers')
      .update({
        name: form.name,
        email: form.email,
        phone: form.phone,
      })
      .eq('id', customer.id);

    if (error) {
      alert('Update failed');
      console.error(error);
    } else {
      setEditMode(false);
      onUpdate();
    }
  };

  const deleteCustomer = async () => {
    const confirm = window.confirm("Are you sure you want to delete this customer?");
    if (!confirm) return;

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customer.id);

    if (error) {
      alert('Delete failed');
      console.error(error);
    } else {
      onUpdate();
    }
  };

  return (
    <tr className="border-t">
      <td className="py-2 px-4">
        {editMode ? (
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-1 rounded w-full"
          />
        ) : (
          form.name
        )}
      </td>
      <td className="py-2 px-4">
        {editMode ? (
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-1 rounded w-full"
          />
        ) : (
          form.email
        )}
      </td>
      <td className="py-2 px-4">
        {editMode ? (
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border p-1 rounded w-full"
          />
        ) : (
          form.phone
        )}
      </td>
      <td className="py-2 px-4 space-x-2">
        {editMode ? (
          <>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={saveEdit}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-2 py-1 rounded"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-yellow-500 text-white px-2 py-1 rounded"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded"
              onClick={deleteCustomer}
            >
              Delete
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => navigate(`/customers/${customer.id}/bookings`)}
            >
              View Bookings
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
