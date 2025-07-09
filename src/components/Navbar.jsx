import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon as SearchIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { currentPage, user } = useContext(AppContext); // ✅ get user directly from context

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">{currentPage}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-600" />
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.username || 'Guest'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'No Role'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
