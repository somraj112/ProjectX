import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';

const Topbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="h-[72px] bg-white flex items-center justify-between px-8 sticky top-0 z-10">
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
          
          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-colors flex items-center justify-center bg-gray-50 text-gray-400">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 mt-1 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <Settings size={16} className="text-gray-400" />
                  Profile Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Topbar;
