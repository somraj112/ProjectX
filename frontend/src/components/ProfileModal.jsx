import React, { useState } from 'react';
import { X, Camera, Loader2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    if (bio !== user.bio) {
      formData.append('bio', bio);
    }
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">User Profile</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center">
            {/* Avatar Upload */}
            <div className="relative group cursor-pointer mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                {previewUrl ? (
                  <img src={previewUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500">
                    <User size={40} />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={24} />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange} 
                />
              </label>
            </div>

            {/* Read-only Info */}
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{user.email}</p>

            <div className="w-full grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">College ID</p>
                <p className="text-sm font-semibold text-gray-900">{user.collegeId}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">Department</p>
                <p className="text-sm font-semibold text-gray-900">{user.department}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
                <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">Year</p>
                <p className="text-sm font-semibold text-gray-900">{user.year}</p>
              </div>
            </div>

            {/* Editable Bio */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us a little about yourself..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || (bio === user.bio && !avatarFile)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;
