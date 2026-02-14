import React from 'react';
import { Calendar, MapPin, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const EventCard = ({ event, onRegister }) => {
  return (
    <Card noPadding className="h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <img 
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3'} 
            alt={event.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-black font-bold uppercase tracking-wide text-[10px] px-2 py-1 border-none shadow-sm">
                {event.category || 'Event'}
            </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight">{event.title}</h3>
        
        <div className="space-y-2 mb-6">
            <div className="flex items-center text-gray-500 text-sm">
                <Calendar size={16} className="mr-2.5 text-red-500" /> 
                <span>{event.date}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={16} className="mr-2.5 text-red-500" /> 
                <span>{event.location}</span>
            </div>
        </div>

        <div className="mt-auto">
            <Button 
                className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-3"
                onClick={() => onRegister(event.id)}
            >
                Register
            </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
