import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Calendar, Clock, AlignLeft, Type } from 'lucide-react';
import toast from 'react-hot-toast';

const AddScheduleModal = ({ isOpen, onClose, onCreate, isCreating }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Combine date and time to ISO strings
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();

    if (new Date(startDateTime) >= new Date(endDateTime)) {
      toast.error('End time must be after start time');
      return;
    }

    onCreate({
      title: formData.title,
      description: formData.description,
      startDateTime,
      endDateTime
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Schedule">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Team Meeting"
          icon={Type}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            icon={Calendar}
            required
          />
          <Input
            label="Start Time"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
            icon={Clock}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              icon={Calendar}
              required
            />
            <Input
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              icon={Clock}
              required
            />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
           <div className="relative">
             <div className="absolute top-3 left-3 text-gray-400">
               <AlignLeft size={18} />
             </div>
             <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional description"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
             />
           </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            isLoading={isCreating}
            className="px-6"
          >
            Add to Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddScheduleModal;
