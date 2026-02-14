import React from 'react';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const ItemCard = ({ item, onResolve }) => {
  const isLost = item.type === 'lost';
  const badgeColor = isLost ? 'bg-red-500 text-white' : 'bg-green-500 text-white';

  return (
    <Card noPadding className="h-full flex flex-col group hover:shadow-lg transition-shadow">
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-100">
        <img 
            src={item.image || 'https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?auto=format&fit=crop&q=80&w=1000'} 
            alt={item.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 z-10">
            <Badge className={`${badgeColor} font-bold uppercase tracking-wide text-[10px] px-2 py-1 shadow-sm border-none`}>
                {item.type}
            </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 leading-tight text-lg mb-2">{item.title}</h3>
        
        <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={16} className="mr-2 text-gray-400" /> 
                <span className="line-clamp-1">{item.location}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
                <Calendar size={16} className="mr-2 text-gray-400" /> 
                <span>{item.date}</span>
            </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>

        <div className="mt-auto border-t border-gray-50 pt-4">
            {item.status === 'resolved' ? (
                <div className="w-full py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium flex items-center justify-center">
                    <CheckCircle size={16} className="mr-2" /> Resolved
                </div>
            ) : (
                <Button 
                    variant="outline" 
                    className="w-full justify-center"
                    onClick={() => onResolve(item.id)}
                >
                    Mark as Resolved
                </Button>
            )}
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
