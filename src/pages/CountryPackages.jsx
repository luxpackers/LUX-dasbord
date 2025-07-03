import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function CountryPackages() {
  const { id: countryId } = useParams();
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ package_code: '', sub_route: '' });
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editedPackage, setEditedPackage] = useState({ package_code: '', sub_route: '' });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('packages')
      .select('id, package_code, sub_route')
      .eq('country_id', countryId);
    if (!error) setPackages(data);
  };

  const addPackage = async () => {
    const { error } = await supabase.from('packages').insert([
      { ...newPackage, country_id: countryId },
    ]);
    if (!error) {
      setNewPackage({ package_code: '', sub_route: '' });
      fetchPackages();
    }
  };

  const updatePackage = async (id) => {
    await supabase.from('packages').update(editedPackage).eq('id', id);
    setEditingPackageId(null);
    fetchPackages();
  };

  const deletePackage = async (id) => {
    await supabase.from('packages').delete().eq('id', id);
    fetchPackages();
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 max-w-screen-xl mx-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Packages for Country ID: {countryId}</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Package Code"
          value={newPackage.package_code}
          onChange={(e) => setNewPackage({ ...newPackage, package_code: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Sub Route"
          value={newPackage.sub_route}
          onChange={(e) => setNewPackage({ ...newPackage, sub_route: e.target.value })}
        />
        <button
          onClick={addPackage}
          className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Add Package
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Package Code</th>
              <th className="border px-4 py-2 text-left">Sub Route</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td className="border px-4 py-2">
                  {editingPackageId === pkg.id ? (
                    <input
                      className="border p-1 rounded w-full"
                      value={editedPackage.package_code}
                      onChange={(e) =>
                        setEditedPackage({ ...editedPackage, package_code: e.target.value })
                      }
                    />
                  ) : (
                    pkg.package_code
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingPackageId === pkg.id ? (
                    <input
                      className="border p-1 rounded w-full"
                      value={editedPackage.sub_route}
                      onChange={(e) =>
                        setEditedPackage({ ...editedPackage, sub_route: e.target.value })
                      }
                    />
                  ) : (
                    pkg.sub_route
                  )}
                </td>
                <td className="border px-4 py-2 space-y-1 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                  {editingPackageId === pkg.id ? (
                    <>
                      <button
                        onClick={() => updatePackage(pkg.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPackageId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingPackageId(pkg.id);
                          setEditedPackage({
                            package_code: pkg.package_code,
                            sub_route: pkg.sub_route,
                          });
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id)}
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

