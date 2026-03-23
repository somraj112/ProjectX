import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ItemCard from '../components/lostfound/ItemCard';
import ReportItemModal from '../components/lostfound/ReportItemModal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Tabs from '../components/ui/Tabs';
import lostfoundService from '../services/lostfound.service';
import toast from 'react-hot-toast';

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
        
        let displayItems = itemsArray;

        if (activeTab !== 'All') {
             displayItems = displayItems.filter(item => item.type === activeTab.toLowerCase());
        }

        setItems(displayItems);
    } catch (error) {
        console.error("Failed to fetch lost/found items", error);
        toast.error("Failed to fetch items");
        setItems([]);
    } finally {
        setLoading(false);
    }
  };

  const handleReportItem = async (itemData) => {
    setIsReporting(true);
    try {
        await lostfoundService.reportItem(itemData);
        toast.success("Item reported successfully!");
        setIsModalOpen(false);
        await fetchItems();
    } catch (error) {
        console.error("Failed to report item", error);
        toast.error("Failed to report item");
    } finally {
        setIsReporting(false);
    }
  };

  const handleResolveItem = async (id) => {
      try {
          await lostfoundService.resolveItem(id);
          toast.success("Item resolved successfully!");
          setItems(items.map(item => 
              (item._id || item.id) === id ? { ...item, status: 'resolved' } : item
          ));
      } catch (error) {
          console.error("Failed to resolve item", error);
          toast.error("Failed to resolve item");
      }
  };

  const handleDeleteItem = async (id) => {
      if (window.confirm('Are you sure you want to remove this report?')) {
          try {
              await lostfoundService.deleteItem(id);
              toast.success("Report removed");
              setItems(items.filter(i => (i._id || i.id) !== id));
          } catch (error) {
               console.error("Failed to delete item", error);
               toast.error("Failed to remove report");
          }
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
                    key={item._id || item.id} 
                    item={item} 
                    onResolve={handleResolveItem} 
                    onDelete={handleDeleteItem}
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

export default LostFound;
