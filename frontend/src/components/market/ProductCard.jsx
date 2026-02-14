import React from 'react';
import { Trash2, Phone } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const ProductCard = ({ product, onContact, onDelete }) => {
  return (
    <Card noPadding className="h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-100">
        <img 
            src={product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1770'} 
            alt={product.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-white/90 text-black font-bold uppercase tracking-wide text-[10px] px-2 py-1 shadow-sm border-none">
                {product.category || 'Item'}
            </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 leading-tight text-lg">{product.title}</h3>
            <span className="text-red-500 font-bold ml-2 text-lg">₹{product.price}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description || 'No description provided.'}</p>

        <div className="mt-auto pt-4 flex space-x-2 border-t border-gray-50">
            <Button 
                variant="secondary" 
                className="flex-1 rounded-lg border-gray-200 text-sm font-semibold h-10 hover:bg-gray-50 text-gray-800"
                onClick={() => onContact(product)}
            >
                Contact
            </Button>
            <button 
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                onClick={() => onDelete(product.id)}
            >
                <Trash2 size={16} />
            </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
