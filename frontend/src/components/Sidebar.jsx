import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, MapPin, BookOpen, ShoppingBag, Search, User } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Feed', path: '/feed', icon: Home },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Events', path: '/events', icon: MapPin },
    { name: 'Notes', path: '/notes', icon: BookOpen },
    { name: 'Market', path: '/market', icon: ShoppingBag },
    { name: 'Lost & Found', path: '/lost-found', icon: Search },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 overflow-y-auto hidden md:flex font-sans">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-2">
        <div className="bg-[#FF4D4D] text-white p-1 rounded-lg w-8 h-8 flex items-center justify-center font-bold text-lg">
          U
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">Unifye</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} strokeWidth={2.5} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile (Bottom) */}
      <div className="p-4 border-t border-gray-50">
          <div className="bg-red-500 rounded-2xl p-4 text-white hover:bg-red-600 transition cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </div>
                 <span className="font-bold">Go Premium</span>
              </div>
              <p className="text-xs text-white/80">Unlock analytics & more.</p>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
