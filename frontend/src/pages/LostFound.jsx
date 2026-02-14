import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ItemCard from '../components/lostfound/ItemCard';
import ReportItemModal from '../components/lostfound/ReportItemModal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Tabs from '../components/ui/Tabs';
import lostfoundService from '../services/lostfound.service';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
        const type = activeTab === 'All' ? '' : activeTab.toLowerCase();
        const data = await lostfoundService.getItems(type);
        const itemsArray = Array.isArray(data) ? data : (data.items || []);
        
        let displayItems = itemsArray.length > 0 ? itemsArray : MOCK_Items;

        if (activeTab !== 'All') {
             displayItems = displayItems.filter(item => item.type === activeTab.toLowerCase());
        }

        setItems(displayItems);
    } catch (error) {
        console.error("Failed to fetch lost/found items", error);
        let displayItems = MOCK_Items;
        if (activeTab !== 'All') {
             displayItems = displayItems.filter(item => item.type === activeTab.toLowerCase());
        }
        setItems(displayItems);
    } finally {
        setLoading(false);
    }
  };

  const handleReportItem = async (itemData) => {
    setIsReporting(true);
    try {
        await lostfoundService.reportItem(itemData);
        // Optimistic update
        const newItem = {
            id: Date.now(),
            ...itemData,
            status: 'active',
            image: !itemData.image ? null : URL.createObjectURL(itemData.image) // Temp preview
        };
        setItems([newItem, ...items]);
        setIsModalOpen(false);
    } catch (error) {
        console.error("Failed to report item", error);
    } finally {
        setIsReporting(false);
    }
  };

  const handleResolveItem = async (id) => {
      try {
          await lostfoundService.resolveItem(id);
          setItems(items.map(item => 
              item.id === id ? { ...item, status: 'resolved' } : item
          ));
      } catch (error) {
          console.error("Failed to resolve item", error);
          // Optimistic
          setItems(items.map(item => 
              item.id === id ? { ...item, status: 'resolved' } : item
          ));
      }
  };

  const tabs = ['All', 'Lost', 'Found'];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lost & Found</h1>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Report</Button>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
        />
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
            <Loader size="lg" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <ItemCard 
                    key={item.id} 
                    item={item} 
                    onResolve={handleResolveItem} 
                />
            ))}
        </div>
      ) : (
        <EmptyState 
            title="No items found" 
            description="Everything seems to be in its place!" 
        />
      )}

      <ReportItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onReport={handleReportItem}
        isReporting={isReporting}
      />
    </div>
  );
};

// Mock Data
const MOCK_Items = [
    {
        id: 1,
        type: 'lost',
        title: 'MacBook Air Charger',
        location: 'Library Reading Room',
        date: '2024-12-10',
        description: 'White MagSafe charger left on table 4.',
        status: 'active',
        image: null // Placeholder will be used
    },
    {
        id: 2,
        type: 'found',
        title: 'Silver Key',
        location: 'Cafeteria',
        date: '2024-12-11',
        description: 'Found a silver key with a blue keychain near the juice counter.',
        status: 'active',
        image: null
    },
    {
        id: 3,
        type: 'lost',
        title: 'Blue Water Bottle',
        location: 'Basketball Court',
        date: '2024-12-12',
        description: 'Metal water bottle, has a sticker on it.',
        status: 'resolved',
        image: null
    }
];

export default LostFound;
