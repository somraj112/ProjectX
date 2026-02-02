import React from 'react';
import { Search, Bell } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-[72px] bg-white  flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200 sm:text-sm shadow-sm transition-shadow hover:shadow-md"
            placeholder="Search Unifye..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition relative border border-gray-100">
           <span className="absolute top-2 right-2.5 block h-1.5 w-1.5 rounded-full ring-2 ring-white bg-red-400"></span>
          <Bell size={20} />
        </button>
        {/* Mobile Menu Button - to be implemented for mobile */}
      </div>
    </header>
  );
};

export default Topbar;
