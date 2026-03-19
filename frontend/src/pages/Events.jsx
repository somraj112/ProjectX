import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import CreateEventModal from '../components/events/CreateEventModal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Tabs from '../components/ui/Tabs'; 

import { useAuth } from '../context/AuthContext';
import eventsService from '../services/events.service';
import toast from 'react-hot-toast';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [activeCategory]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
        const data = await eventsService.getEvents(activeCategory);
        const allEvents = Array.isArray(data) ? data : (data.events || []);
        setEvents(allEvents);
    } catch (error) {
        console.error("Failed to fetch events", error);
        toast.error("Failed to load events");
        setEvents([]);
    } finally {
        setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    setIsCreating(true);
    try {
        await eventsService.createEvent(eventData);
        toast.success("Event created successfully");
        setIsModalOpen(false);
        await fetchEvents();
    } catch (error) {
        console.error("Failed to create event", error);
        toast.error("Failed to create event");
    } finally {
        setIsCreating(false);
    }
  };

  const handleUpdateEvent = async (id, eventData) => {
    setIsCreating(true);
    try {
        await eventsService.updateEvent(id, eventData);
        toast.success("Event updated successfully");
        setIsModalOpen(false);
        setSelectedEvent(null);
        await fetchEvents();
    } catch (error) {
        console.error("Failed to update event", error);
        toast.error("Failed to update event");
    } finally {
        setIsCreating(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
        await eventsService.deleteEvent(id);
        toast.success("Event deleted successfully");
        await fetchEvents();
    } catch (error) {
        console.error("Failed to delete event", error);
        toast.error("Failed to delete event");
    }
  };

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop'];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Create</Button>
      </div>

      {/* Filters */}
      <div className="mb-8 overflow-x-auto pb-2">
        <Tabs 
            tabs={categories} 
            activeTab={activeCategory} 
            onTabChange={setActiveCategory} 
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
            <Loader size="lg" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <EventCard 
                   key={event._id || event.id} 
                   event={event} 
                   currentUser={user}
                   onRegister={(id) => console.log('Register', id)} 
                   onEdit={(evt) => { setSelectedEvent(evt); setIsModalOpen(true); }}
                   onDelete={handleDeleteEvent}
                />
            ))}
        </div>
      ) : (
        <EmptyState 
            title="No events found" 
            description="Try changing the category or create a new event." 
        />
      )}

      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedEvent(null); }} 
        onCreate={handleCreateEvent}
        onUpdate={handleUpdateEvent}
        isCreating={isCreating}
        initialData={selectedEvent}
      />
    </div>
  );
};

export default Events;
