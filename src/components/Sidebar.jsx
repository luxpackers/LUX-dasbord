import { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  HomeIcon,
  BriefcaseIcon,
  ShoppingCartIcon,
  UsersIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/' },
    { name: 'Inventory', icon: BriefcaseIcon, path: '/inventory' },
    { name: 'Sales', icon: ShoppingCartIcon, path: '/sales' },
    { name: 'Users', icon: UsersIcon, path: '/users' },
    { name: 'Customers', icon: UserGroupIcon, path: '/customers' },
    { name: 'Reports', icon: ChartBarIcon, path: '/reports' },
    { name: 'Settings', icon: CogIcon, path: '/settings' },
    { name: 'Internships', icon: BriefcaseIcon, path: '/internship-admin' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('lux_user'); // ✅ Clear the correct key
    navigate('/login'); // ✅ Go to login page
    window.location.reload(); // ✅ Optional: force refresh to clear UI state
  };

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between border-b border-indigo-700">
        {sidebarOpen ? (
          <h1 className="text-2xl font-bold">LuxPackers</h1>
        ) : (
          <h1 className="text-2xl font-bold">LP</h1>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-indigo-700"
        >
          {sidebarOpen ? '«' : '»'}
        </button>
      </div>
      
      <nav className="flex-1 mt-6">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 ${sidebarOpen ? 'px-6' : 'px-3 justify-center'} 
                  ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-700'} rounded-lg transition-colors`
                }
              >
                <item.icon className="h-6 w-6" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-700"
        >
          <LogoutIcon className="h-6 w-6" />
          {sidebarOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;



