import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] flex font-sans text-gray-900">
      {/* Sidebar - Hidden on mobile, fixed on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <Topbar />
        
        {/* Scrollable Content */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
