import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  // ✅ Init user from localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('lux_user');
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ Always sync localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('lux_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lux_user');
    }
  }, [user]);

  const [packages, setPackages] = useState([
    { id: 1, name: 'European Delight', destination: 'Paris', price: 250000, stock: 15, bookings: 42 },
    { id: 2, name: 'Asian', destination: 'Bali', price: 32000, stock: 8, bookings: 28 },
    { id: 3, name: 'India', destination: 'Goa', price: 50000, stock: 5, bookings: 15 },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Shlok', email: 'shlok@example.com', role: 'admin', lastLogin: '2023-05-15' },
    { id: 2, name: 'rohan', email: 'ro@example.com', role: 'agent', lastLogin: '2023-05-14' },
    { id: 3, name: 'pali', email: 'pali@example.com', role: 'customer', lastLogin: '2023-05-10' },
  ]);

  const [sales, setSales] = useState([
    { id: 1, packageId: 1, customer: 'jojo', date: '2023-05-01', amount: 250000, status: 'completed' },
    { id: 2, packageId: 2, customer: 'virat', date: '2023-05-05', amount: 32000, status: 'completed' },
    { id: 3, packageId: 1, customer: 'gareb', date: '2023-05-10', amount: 2500, status: 'pending' },
  ]);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen, setSidebarOpen,
        currentPage, setCurrentPage,
        packages, setPackages,
        users, setUsers,
        sales, setSales,
        user, setUser // ✅ Pass user state
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
