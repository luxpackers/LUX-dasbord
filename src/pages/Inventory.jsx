import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import Layout from '../components/Layout'; // if using layout wrapper (optional)

export default function Inventory() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCountry, setNewCountry] = useState({ sub_route: '', title: '' });
  const [editingCountryId, setEditingCountryId] = useState(null);
  const [editedCountry, setEditedCountry] = useState({ sub_route: '', title: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const { data, error } = await supabase.from('countries').select('*');
    if (!error) setCountries(data);
    setLoading(false);
  };

  const addCountry = async () => {
    const { error } = await supabase.from('countries').insert([
      {
        sub_route: newCountry.sub_route,
        country_data: { title: newCountry.title },
      },
    ]);
    if (!error) {
      setNewCountry({ sub_route: '', title: '' });
      fetchCountries();
    }
  };

  const deleteCountry = async (id) => {
    await supabase.from('countries').delete().eq('id', id);
    fetchCountries();
  };

  const updateCountry = async (id) => {
    await supabase.from('countries').update({
      sub_route: editedCountry.sub_route,
      country_data: { title: editedCountry.title },
    }).eq('id', id);
    setEditingCountryId(null);
    fetchCountries();
  };

  return (
    // Remove <Layout> if not using a global wrapper
    <div className="px-4 sm:px-6 md:px-10 py-6 max-w-screen-xl mx-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Countries</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Sub Route"
          value={newCountry.sub_route}
          onChange={(e) => setNewCountry({ ...newCountry, sub_route: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Title"
          value={newCountry.title}
          onChange={(e) => setNewCountry({ ...newCountry, title: e.target.value })}
        />
        <button
          onClick={addCountry}
          className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Add Country
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Sub Route</th>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.id}>
                <td className="border px-4 py-2">
                  {editingCountryId === country.id ? (
                    <input
                      className="border p-1 rounded w-full"
                      value={editedCountry.sub_route}
                      onChange={(e) =>
                        setEditedCountry({ ...editedCountry, sub_route: e.target.value })
                      }
                    />
                  ) : (
                    country.sub_route
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingCountryId === country.id ? (
                    <input
                      className="border p-1 rounded w-full"
                      value={editedCountry.title}
                      onChange={(e) =>
                        setEditedCountry({ ...editedCountry, title: e.target.value })
                      }
                    />
                  ) : (
                    country.country_data?.title
                  )}
                </td>
                <td className="border px-4 py-2 space-y-1 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                  {editingCountryId === country.id ? (
                    <>
                      <button
                        onClick={() => updateCountry(country.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCountryId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate(`/packages/${country.id}`)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        View Packages
                      </button>
                      <button
                        onClick={() => {
                          setEditingCountryId(country.id);
                          setEditedCountry({
                            sub_route: country.sub_route,
                            title: country.country_data?.title || '',
                          });
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCountry(country.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
