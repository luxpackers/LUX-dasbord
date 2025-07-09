import { useContext } from 'react';
import { AppContext } from './context/AppContext'; // make sure this path is correct
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Users from './pages/Users';
import Customers from './pages/Customers';
import CustomerBookings from './pages/CustomerBookings';
import Login from './pages/Login';
import './styles.css';
import CountryPackages from './pages/CountryPackages';
import InternshipDashboard from './pages/InternshipDashboard';
import FlightInfo from './pages/FlightInfo';
import AccommodationInfo from './pages/AccommodationInfo';

function App() {
  const { user } = useContext(AppContext); // ✅ Now this will work without error

  return (
    <Router>
      {user ? (
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/users" element={<Users />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:id/bookings" element={<CustomerBookings />} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/packages/:id" element={<CountryPackages />} />
                <Route path="/internship-admin" element={<InternshipDashboard />} />
                <Route path="/bookings/:bookingId/flights" element={<FlightInfo />} />
                <Route path="/bookings/:bookingId/accommodations" element={<AccommodationInfo />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
