import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => {
        // Handle both simple string arrays or object arrays with value/label
        const value = typeof tab === 'object' ? tab.value : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const isActive = activeTab === value;
        
        return (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              isActive
                ? 'bg-black text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {typeof tab === 'object' ? tab.label : tab}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
