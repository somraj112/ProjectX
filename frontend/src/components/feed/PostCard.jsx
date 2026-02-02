import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.obj?.likes || 0); // Handle potential missing fields

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    // In a real app, we'd trigger an API call here
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
             {post.user ? post.user.name[0] : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{post.name || (post.user ? post.user.name : 'Unknown User')}</h3>
            <p className="text-xs text-gray-400">{post.time || 'Just now'}</p>
          </div>
        </div>
        <button className="text-gray-300 hover:text-gray-600">
            <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </p>
      
      {post.image && (
        <div className="mb-4 rounded-xl overflow-hidden">
            <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-96" />
        </div>
      )}

      {/* Footer / Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex space-x-6">
            <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
                <Heart size={20} fill={liked ? "currentColor" : "none"} />
                <span>{likeCount}</span>
            </button>
            <button className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle size={20} />
                <span>{post.comments || 0}</span>
            </button>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
