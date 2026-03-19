import React, { useState, useRef } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const CreateEventModal = ({ isOpen, onClose, onCreate, onUpdate, isCreating, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    date: '',
    time: '',
    location: '',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const imageInputRef = useRef(null);

  React.useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || '',
        category: initialData.type || 'Technical',
        date: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        time: initialData.startTime || '',
        location: initialData.location || '',
        description: initialData.description || '',
        image: ''
      });
    } else {
      setFormData({
        title: '',
        category: 'Technical',
        date: '',
        time: '',
        location: '',
        description: '',
      });
      setPreview(null);
      setFile(null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
     setFormData(prev => ({ ...prev, category: e.target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      type: formData.category,
      startDate: formData.date,
      endDate: formData.date, // Defaulting to 1-day event
      startTime: formData.time,
      endTime: formData.time, // Defaulting to same starting block
      location: formData.location,
      description: formData.description,
    };

    if (file) {
      payload.image = file;
    }

    if (initialData) {
      onUpdate(initialData._id, payload);
    } else {
      onCreate(payload);
    }
  };

  const categoryOptions = [
      { value: 'Technical', label: 'Technical' },
      { value: 'Cultural', label: 'Cultural' },
      { value: 'Sports', label: 'Sports' },
      { value: 'Workshop', label: 'Workshop' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Event" : "Create New Event"}>
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

        {/* Image Upload Area */}
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Cover Image</span>
            {preview ? (
                <div className="relative inline-block rounded-xl overflow-hidden border border-gray-200">
                    <img src={preview} alt="Preview" className="max-h-48 w-full object-cover" />
                    <button 
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 focus:outline-none"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : initialData && initialData.imageUrl ? (
                <div className="relative inline-block rounded-xl overflow-hidden border border-gray-200">
                    <img src={initialData.imageUrl} alt="Current" className="max-h-48 w-full object-cover opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-black/20">
                         <span className="text-white text-sm drop-shadow-md font-medium">Current Image</span>
                         <Button type="button" size="sm" onClick={() => imageInputRef.current?.click()} className="bg-white/90 text-black hover:bg-white text-xs py-1">Change Image</Button>
                    </div>
                </div>
            ) : (
                <button 
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-red-500 transition-colors text-gray-500 hover:text-red-500"
                >
                  <ImageIcon size={24} className="mb-2" />
                  <span className="text-sm">Click to upload image</span>
                </button>
            )}
            <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={imageInputRef} 
                onChange={handleFileChange} 
            />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isCreating}>{initialData ? 'Save Changes' : 'Create Event'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventModal;
