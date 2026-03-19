import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProductCard from '../components/market/ProductCard';
import SellItemModal from '../components/market/SellItemModal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Tabs from '../components/ui/Tabs';
import marketService from '../services/market.service';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListing, setIsListing] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
        const data = await marketService.getItems(activeCategory === 'All' ? '' : activeCategory);
        const itemsArray = Array.isArray(data) ? data : (data.items || []);
        
        let displayItems = itemsArray;
        if (activeCategory !== 'All') {
            displayItems = displayItems.filter(item => item.category === activeCategory);
        }

        setItems(displayItems);
    } catch (error) {
        console.error("Failed to fetch market items", error);
        toast.error("Failed to fetch market items");
        setItems([]);
    } finally {
        setLoading(false);
    }
  };

  const handleSellItem = async (itemData) => {
    setIsListing(true);
    try {
        await marketService.listItem(itemData);
        toast.success("Item listed successfully!");
        setIsModalOpen(false);
        await fetchItems();
    } catch (error) {
        console.error("Failed to list item", error);
        toast.error("Failed to list item");
    } finally {
        setIsListing(false);
    }
  };
  
  const handleDeleteItem = async (id) => {
      if (window.confirm('Are you sure you want to remove this listing?')) {
          try {
              await marketService.deleteItem(id);
              toast.success("Item removed");
              setItems(items.filter(i => (i._id || i.id) !== id));
          } catch (error) {
               console.error("Failed to delete item", error);
               toast.error("Failed to remove item");
          }
      }
  }

  const handleContact = (product) => {
      alert(`Contact seller for: ${product.title}\nIn valid app, this would open chat or show phone number.`);
  }

  const categories = ['All', 'Books', 'Electronics', 'Stationery', 'Others'];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Market</h1>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Sell</Button>
      </div>

      {/* Filters */}
      <div className="mb-8 overflow-x-auto pb-2">
         <Tabs 
            tabs={categories} 
            activeTab={activeCategory} 
            onTabChange={setActiveCategory} 
        />
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
            <Loader size="lg" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
                <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    onContact={handleContact}
                    onDelete={handleDeleteItem}
                />
            ))}
        </div>
      ) : (
        <EmptyState 
            title="No items found" 
            description="Be the first to list something in this category!" 
        />
      )}

      <SellItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSell={handleSellItem}
        isListing={isListing}
      />
    </div>
  );
};

export default Marketplace;
