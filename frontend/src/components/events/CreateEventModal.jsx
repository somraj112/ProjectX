import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const CreateEventModal = ({ isOpen, onClose, onCreate, isCreating }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '' // URL or file handling later
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
     setFormData(prev => ({ ...prev, category: e.target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  const categoryOptions = [
      { value: 'Technical', label: 'Technical' },
      { value: 'Cultural', label: 'Cultural' },
      { value: 'Sports', label: 'Sports' },
      { value: 'Workshop', label: 'Workshop' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
            label="Event Title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Ex: Annual Tech Fest"
            required
        />
        
        <div className="grid grid-cols-2 gap-4">
            <Select 
                label="Category" 
                name="category"
                value={formData.category}
                onChange={handleSelectChange} // Select component might need specific handling depending on implementation, creating generic handler
                options={categoryOptions}
            />
            <Input 
                label="Date" 
                name="date" 
                type="date"
                value={formData.date} 
                onChange={handleChange}
                required
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Input 
                label="Time" 
                name="time" 
                type="time"
                value={formData.time} 
                onChange={handleChange}
                required
            />
             <Input 
                label="Location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                placeholder="Ex: Main Auditorium"
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 min-h-[100px]"
                placeholder="Details about the event..."
            />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isCreating}>Create Event</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventModal;
