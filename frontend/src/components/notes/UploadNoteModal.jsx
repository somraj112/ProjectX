import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { UploadCloud } from 'lucide-react';

const UploadNoteModal = ({ isOpen, onClose, onUpload, isUploading }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    tags: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert comma separate tags to array
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    onUpload({
        ...formData,
        tags: tagsArray
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Note">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
            label="Title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Ex: DSA Complete Guide"
            required
        />
        
        <Input 
            label="Subject" 
            name="subject" 
            value={formData.subject} 
            onChange={handleChange} 
            placeholder="Ex: Computer Science"
            required
        />

        <Input 
            label="Tags (comma separated)" 
            name="tags" 
            value={formData.tags} 
            onChange={handleChange} 
            placeholder="Ex: DSA, Trees, Graphs"
        />

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-red-400 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, PPT up to 10MB</p>
                    {formData.file && (
                        <p className="text-sm text-green-600 font-semibold mt-2">Selected: {formData.file.name}</p>
                    )}
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isUploading} disabled={!formData.file}>Upload</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadNoteModal;
