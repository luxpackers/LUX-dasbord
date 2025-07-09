import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

const InternshipDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("internship_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error.message);
    } else {
      setApplications(data);
    }

    setLoading(false);
  };

  const toggleDetails = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Internship Applications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{app.full_name}</p>
                  <p className="text-gray-600 text-sm">{app.email}</p>
                </div>
                <button
                  onClick={() => toggleDetails(app.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  {selectedId === app.id ? "Hide Details" : "View Details"}
                </button>
              </div>

              {/* Conditional full details */}
              {selectedId === app.id && (
                <div className="mt-4 text-sm space-y-1">
                  <p><strong>Phone:</strong> {app.phone}</p>
                  <p><strong>Age:</strong> {app.age}</p>
                  <p><strong>City & State:</strong> {app.city_state}</p>
                  <p><strong>Instagram:</strong> {app.instagram_handle}</p>
                  <p>
                    <strong>Portfolio:</strong>{" "}
                    <a href={app.portfolio_link} target="_blank" className="text-blue-600 underline">
                      {app.portfolio_link}
                    </a>
                  </p>
                  <p>
                    <strong>Sample Content:</strong>{" "}
                    <a href={app.sample_file_url} target="_blank" className="text-blue-600 underline">
                      {app.sample_file_url}
                    </a>
                  </p>
                  <p><strong>Created Content Before:</strong> {app.created_content}</p>
                  <p><strong>Confident Skills:</strong> {app.confident_skills?.join(", ")}</p>
                  <p><strong>Why Lux-Packers:</strong> {app.reason}</p>
                  <p><strong>Reel Idea:</strong> {app.reel_idea}</p>
                  <p><strong>Travel Opinion:</strong> {app.travel_content_opinion}</p>
                  <p><strong>Camera Comfort:</strong> {app.camera_comfort}</p>
                  <p><strong>Obligations:</strong> {app.obligations}</p>
                  <p><strong>Outdoor Travel OK:</strong> {app.outdoor_travel_comfort}</p>
                  <p><strong>Preferred Communication:</strong> {app.communication_mode}</p>
                  <p><strong>Referral Source:</strong> {app.referral_source}</p>
                  {app.referral_other && (
                    <p><strong>Other Referral:</strong> {app.referral_other}</p>
                  )}
                  <p><strong>Questions:</strong> {app.questions}</p>
                  <p><strong>Submitted On:</strong> {new Date(app.created_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipDashboard;

