import React, { useState } from 'react';
import { Image, Video, Send } from 'lucide-react';
import Button from '../ui/Button';


const CreatePost = ({ onPost, isPosting }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPost({ content });
    setContent('');
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
           {/* Simple Avatar Placeholder since Avatar component might have been deleted */}
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
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <Image size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <Video size={20} />
              </button>
            </div>
            <Button 
                onClick={handleSubmit} 
                disabled={!content.trim() || isPosting}
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
