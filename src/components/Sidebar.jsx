import { useContext, useEffect, useState } from 'react';
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
  ArrowLeftOnRectangleIcon as LogoutIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Run once
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

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
    localStorage.removeItem('lux_user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      {/* Three dots button for mobile */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-indigo-800 text-white p-2 rounded-full shadow-lg"
        >
          <EllipsisVerticalIcon className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-40 bg-indigo-800 text-white flex flex-col transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
          ${isMobile ? '' : 'md:static md:w-64'}
        `}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          <h1 className="text-2xl font-bold">LuxPackers</h1>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-indigo-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={item.path}
                  onClick={() => isMobile && setSidebarOpen(false)} // close on mobile tap
                  className={({ isActive }) =>
                    `flex items-center p-3 px-6 ${
                      isActive ? 'bg-indigo-900' : 'hover:bg-indigo-700'
                    } rounded-lg transition-colors`
                  }
                >
                  <item.icon className="h-6 w-6" />
                  <span className="ml-3">{item.name}</span>
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
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
