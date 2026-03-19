import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Loader as LoaderIcon, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import scheduleService from '../../services/schedule.service';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import EmptyState from '../ui/EmptyState';
import AddScheduleModal from './AddScheduleModal';
import ScheduleCalendar from './ScheduleCalendar';
// If Tabs component exists, we can use it, else basic buttons for now as per Events.jsx example
// import Tabs from '../ui/Tabs'; 

const SchedulePage = () => {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState({ personal: [], college: [] });
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'college'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(true); // Assume true initially

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await scheduleService.getSchedule();
      
      // Parse dates for FullCalendar
      const formatEvents = (events, color) => 
        (events || []).map(e => ({
          ...e,
          start: e.start?.dateTime || e.start?.date || e.startDateTime || e.start, // Handle various date formats potentially coming from GCal or DB
          end: e.end?.dateTime || e.end?.date || e.endDateTime || e.end,
          backgroundColor: color,
          borderColor: color,
          title: e.summary || e.title // GCal uses 'summary'
        }));

      const eventsList = Array.isArray(data) ? data : data.personal || [];
      const collegeList = Array.isArray(data) ? [] : data.college || [];

      setScheduleData({
        personal: formatEvents(eventsList, '#3B82F6'), // Blue
        college: formatEvents(collegeList, '#F97316')   // Orange
      });
      setGoogleConnected(true);
    } catch (error) {
      console.error("Failed to fetch schedule", error);
      if (error.response?.data?.message === 'Google Calendar not connected' || error.message?.includes('Google Calendar not connected') || error.response?.status === 403) { // Adjust condition based on actual API error
         setGoogleConnected(false);
      } else {
         toast.error("Failed to load schedule");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (data) => {
    setIsCreating(true);
    try {
      await scheduleService.createSchedule(data);
      toast.success("Schedule added successfully!");
      setIsModalOpen(false);
      fetchSchedule(); // Refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to add schedule");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSchedule = async (id, data) => {
    setIsCreating(true);
    try {
      await scheduleService.updateSchedule(id, data);
      toast.success("Schedule updated successfully!");
      setIsModalOpen(false);
      setSelectedEvent(null);
      fetchSchedule(); // Refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to update schedule");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await scheduleService.deleteSchedule(id);
      toast.success("Schedule deleted successfully!");
      setIsModalOpen(false);
      setSelectedEvent(null);
      fetchSchedule(); // Refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete schedule");
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleConnectGoogle = async () => {
    try {
        const { url } = await scheduleService.connectGoogle();
        if (url) {
            window.location.href = url;
        } else {
            toast.error("Failed to get connection URL");
        }
    } catch (error) {
        toast.error("Error initiating Google connection");
    }
  };

  const currentEvents = activeTab === 'personal' ? scheduleData.personal : scheduleData.college;

  if (loading) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!googleConnected) {
     return (
        <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center space-y-4">
            <EmptyState 
                title="Google Calendar Not Connected"
                description="Connect your Google Calendar to view and manage your schedule."
                icon={CalendarIcon}
            />
            <Button onClick={handleConnectGoogle} className="mt-4">
                Connect Google Calendar
            </Button>
        </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
           <p className="text-gray-500 text-sm mt-1">Manage your academic and personal calendar.</p>
        </div>
        
        <div className="flex items-center gap-3">
             {/* Toggle Tabs */}
            <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                        activeTab === 'personal' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    My Schedule
                </button>
                <button
                    onClick={() => setActiveTab('college')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                        activeTab === 'college' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    College Schedule
                </button>
            </div>

            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Add Schedule
            </Button>
        </div>
      </div>

      <ScheduleCalendar events={currentEvents} onEventClick={handleEventClick} />

      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onCreate={handleCreateSchedule}
        onUpdate={handleUpdateSchedule}
        onDelete={handleDeleteSchedule}
        isCreating={isCreating}
        initialData={selectedEvent}
      />
    </div>
  );
};

export default SchedulePage;
