import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProductCard from '../components/market/ProductCard';
import SellItemModal from '../components/market/SellItemModal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Tabs from '../components/ui/Tabs';
import marketService from '../services/market.service';

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
        
        let displayItems = itemsArray.length > 0 ? itemsArray : MOCK_ITEMS;
        
        if (activeCategory !== 'All') {
            displayItems = displayItems.filter(item => item.category === activeCategory);
        }

        setItems(displayItems);
    } catch (error) {
        console.error("Failed to fetch market items", error);
        let displayItems = MOCK_ITEMS;
        if (activeCategory !== 'All') {
            displayItems = displayItems.filter(item => item.category === activeCategory);
        }
        setItems(displayItems);
    } finally {
        setLoading(false);
    }
  };

  const handleSellItem = async (itemData) => {
    setIsListing(true);
    try {
        await marketService.listItem(itemData);
        // Optimistic update
        const newItem = {
            id: Date.now(),
            ...itemData,
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=2664' // Placeholder for now
        };
        setItems([newItem, ...items]);
        setIsModalOpen(false);
    } catch (error) {
        console.error("Failed to list item", error);
    } finally {
        setIsListing(false);
    }
  };
  
  const handleDeleteItem = async (id) => {
      if (window.confirm('Are you sure you want to remove this listing?')) {
          try {
              await marketService.deleteItem(id);
              setItems(items.filter(i => i.id !== id));
          } catch (error) {
               console.error("Failed to delete item", error);
               setItems(items.filter(i => i.id !== id));
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
                    key={product.id} 
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

// Mock Data
const MOCK_ITEMS = [
    {
        id: 1,
        title: 'Engineering Graphics Drafter',
        price: '450',
        category: 'Stationery',
        description: 'Lightly used drafter, perfect for 1st year students.',
        image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 2,
        title: 'Scientific Calculator FX-991',
        price: '800',
        category: 'Electronics',
        description: 'Casio FX-991EX Classwiz. No scratches.',
        image: 'https://images.unsplash.com/photo-1594917424603-2470fe4fb672?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 3,
        title: 'Python Textbooks (Set of 3)',
        price: '300',
        category: 'Books',
        description: 'O Reilly Python books. Good condition.',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 4,
        title: 'Lab Coat (Medium)',
        price: '200',
        category: 'Others',
        description: 'White lab coat, size M. Used for one semester.',
        image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1000'
    }
];

export default Marketplace;
