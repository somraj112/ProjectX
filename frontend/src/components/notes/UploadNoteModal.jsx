import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { UploadCloud, Paperclip, Link as LinkIcon, File as FileIcon } from 'lucide-react';

const SEMESTER_OPTIONS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

const UploadNoteModal = ({ isOpen, onClose, onUpload, onUpdate, isUploading, editNote }) => {
  const isEditMode = !!editNote;
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    semester: '',
    tags: '',
    file: null,
    externalLink: '',
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isOpen) {
      if (editNote) {
        setFormData({
          title: editNote.title || '',
          subject: editNote.subject || '',
          semester: editNote.semester !== 'N/A' ? editNote.semester : '',
          tags: (editNote.tags || []).join(', '),
          file: null,
          externalLink: editNote.externalLink || '',
        });
        setUploadType(editNote.externalLink ? 'link' : 'file');
      } else {
        setFormData({ 
          title: '', 
          subject: '', 
          semester: '', 
          tags: '', 
          file: null, 
          externalLink: '' 
        });
        setUploadType('file');
      }
    }
  }, [isOpen, editNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    // Clear the other field based on selected type
    const payload = { 
      ...formData, 
      tags: tagsArray,
      externalLink: uploadType === 'link' ? formData.externalLink : '',
      file: uploadType === 'file' ? formData.file : null
    };

    if (isEditMode) {
      onUpdate(editNote._id, payload);
    } else {
      onUpload(payload);
    }
  };

  const existingAttachment = editNote?.attachments?.[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Note' : 'Upload Note'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input type selection */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
              uploadType === 'file' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setUploadType('file')}
          >
            <FileIcon size={16} />
            File Upload
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
              uploadType === 'link' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setUploadType('link')}
          >
            <LinkIcon size={16} />
            External Link
          </button>
        </div>

        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: DSA Complete Guide"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Ex: Computer Science"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required={!isEditMode}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none"
            >
              <option value="" disabled>Select semester</option>
              {SEMESTER_OPTIONS.map(sem => (
                <option key={sem} value={sem}>{sem} Semester</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Tags (comma separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Ex: DSA, Trees, Graphs"
        />

        {/* Dynamic Content based on upload type */}
        {uploadType === 'link' ? (
          <Input
            label="Google Drive / External Link"
            name="externalLink"
            value={formData.externalLink}
            onChange={handleChange}
            placeholder="https://drive.google.com/..."
            icon={LinkIcon}
            required={uploadType === 'link'}
          />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditMode ? 'Replace File (optional)' : 'File'}
            </label>

            {/* Show existing file when editing */}
            {isEditMode && existingAttachment && !formData.file && (
              <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                <Paperclip size={14} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{existingAttachment.fileName}</span>
                <span className="ml-auto text-xs uppercase text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {existingAttachment.fileType}
                </span>
              </div>
            )}

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-red-400 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                    <span>{isEditMode ? 'Choose new file' : 'Upload a file'}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf,image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF or image files up to 15MB</p>
                {formData.file && (
                  <p className="text-sm text-green-600 font-semibold mt-1">
                    ✓ {formData.file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            isLoading={isUploading}
            disabled={isEditMode ? false : (uploadType === 'file' ? !formData.file : !formData.externalLink)}
          >
            {isEditMode ? 'Save Changes' : 'Upload'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadNoteModal;
