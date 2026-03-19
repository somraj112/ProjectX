import React, { useState, useRef } from 'react';
import { Image, Video, X } from 'lucide-react';
import Button from '../ui/Button';

const CreatePost = ({ onPost, isPosting }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

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
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;
    onPost({ content, image: file });
    setContent('');
    removeFile();
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
           <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
              ME
           </div>
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on campus?"
            className="w-full resize-none border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-lg min-h-[80px] p-0"
          />
          
          {preview && (
              <div className="relative mb-4 mt-2 inline-block rounded-xl overflow-hidden border border-gray-200">
                  {file && file.type.startsWith('video/') ? (
                      <video src={preview} className="max-h-60 w-auto" controls />
                  ) : (
                      <img src={preview} alt="Preview" className="max-h-60 w-auto object-contain" />
                  )}
                  <button 
                      onClick={removeFile}
                      className="absolute top-2 right-2 bg-gray-900/50 text-white p-1 rounded-full hover:bg-gray-900 focus:outline-none"
                  >
                      <X size={16} />
                  </button>
              </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <div className="flex space-x-2">
              <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={imageInputRef} 
                  onChange={handleFileChange} 
              />
              <button 
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  type="button"
              >
                <Image size={20} />
              </button>
              
              <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={videoInputRef} 
                  onChange={handleFileChange} 
              />
              <button 
                  onClick={() => videoInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  type="button"
              >
                <Video size={20} />
              </button>
            </div>
            <Button 
                onClick={handleSubmit} 
                disabled={(!content.trim() && !file) || isPosting}
                isLoading={isPosting}
                size="sm"
                className="rounded-full px-6"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
