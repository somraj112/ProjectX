import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { UploadCloud } from 'lucide-react';

const ReportItemModal = ({ isOpen, onClose, onReport, isReporting }) => {
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    location: '',
    date: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
      setFormData(prev => ({ ...prev, type: e.target.value }));
  }

  const handleFileChange = (e) => {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onReport(formData);
  };

  const typeOptions = [
      { value: 'lost', label: 'Lost Item' },
      { value: 'found', label: 'Found Item' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
            <Select 
                label="Type" 
                name="type"
                value={formData.type}
                onChange={handleSelectChange}
                options={typeOptions}
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

        <Input 
            label="Item Name" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Ex: Blue Water Bottle"
            required
        />
        
        <Input 
            label="Location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            placeholder="Ex: Library Reading Room"
            required
        />

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 min-h-[80px]"
                placeholder="Color, brand, distinguishing marks..."
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-red-400 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="lf-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                            <span>Upload an image</span>
                            <input id="lf-image-upload" name="image" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                        </label>
                    </div>
                    {formData.image && (
                         <p className="text-sm text-green-600 font-semibold mt-2">Selected: {formData.image.name}</p>
                    )}
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isReporting}>Submit Report</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportItemModal;
