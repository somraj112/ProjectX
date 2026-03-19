import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Edit2, Send, X, Check } from 'lucide-react';
import feedService from '../../services/feed.service';
import commentService from '../../services/comment.service';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PostCard = ({ post, onDelete, onEdit }) => {
  const { user } = useAuth();
  
  // Initialize liked state checking if user ID is in the likes array
  const isLikedByMe = post.likes && user ? post.likes.includes(user._id) : false;
  const [liked, setLiked] = useState(isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  
  // Options & Edit state
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  // Full Screen Image state
  const [fullScreenImage, setFullScreenImage] = useState(false);

  // Author check for delete permission
  const authorId = post.authorId?._id || post.authorId;
  const isAuthor = user && authorId === user._id;

  const handleLike = async () => {
    try {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        await feedService.likePost(post._id || post.id);
    } catch (error) {
        // Revert on failure
        setLiked(!liked);
        setLikeCount(liked ? likeCount + 1 : likeCount - 1);
        toast.error("Failed to like post");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
        try {
            await feedService.deletePost(post._id || post.id);
            toast.success("Post deleted");
            if (onDelete && typeof onDelete === 'function') {
                onDelete(post._id || post.id);
            }
        } catch (error) {
            console.error("Failed to delete post", error);
            toast.error("Failed to delete post");
        }
    }
    setShowOptions(false);
  };

  const handleUpdate = async () => {
      if (!editContent.trim()) {
          toast.error("Post cannot be empty");
          return;
      }
      setIsUpdating(true);
      try {
          const updatedData = await feedService.editPost(post._id || post.id, { content: editContent });
          toast.success("Post updated");
          setIsEditing(false);
          if (onEdit && typeof onEdit === 'function') {
              onEdit(updatedData.post);
          }
      } catch (error) {
          console.error("Failed to update post", error);
          toast.error("Failed to update post");
      } finally {
          setIsUpdating(false);
      }
  };

  const toggleComments = async () => {
      setShowComments(!showComments);
      if (!showComments && comments.length === 0) {
          fetchComments();
      }
  };

  const fetchComments = async () => {
      setLoadingComments(true);
      try {
          const fetchedComments = await commentService.getComments(post._id || post.id);
          setComments(fetchedComments);
      } catch (error) {
          console.error("Failed to fetch comments", error);
      } finally {
          setLoadingComments(false);
      }
  };

  const handleAddComment = async (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;

      try {
          const addedComment = await commentService.addComment(post._id || post.id, newComment);
          setComments([addedComment.comment || addedComment, ...comments]); // Adjust based on actual backend response format
          setNewComment("");
          setCommentCount(prev => prev + 1);
          fetchComments(); // Refresh to ensure correct populate
      } catch (error) {
          console.error("Failed to add comment", error);
          toast.error("Failed to add comment");
      }
  };

  const handleDeleteComment = async (commentId) => {
      try {
          await commentService.deleteComment(commentId);
          setComments(comments.filter(c => c._id !== commentId));
          setCommentCount(prev => Math.max(0, prev - 1));
          toast.success("Comment deleted");
      } catch (error) {
          console.error("Failed to delete comment", error);
          toast.error("Failed to delete comment");
      }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden">
             {post.authorId?.avatarUrl ? (
                 <img src={post.authorId.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                 <>{post.authorId?.name ? post.authorId.name[0] : 'U'}</>
             )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{post.authorId?.name || 'Unknown User'}</h3>
            <p className="text-xs text-gray-400">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
            </p>
          </div>
        </div>
        
        {isAuthor && (
            <div className="relative">
                <button 
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-gray-300 hover:text-gray-600 p-1"
                >
                    <MoreHorizontal size={20} />
                </button>
                {showOptions && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                        <button 
                            onClick={() => { setIsEditing(true); setShowOptions(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <Edit2 size={16} className="mr-2" /> Edit
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                        >
                            <Trash2 size={16} className="mr-2" /> Delete
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
          <div className="mb-4">
              <textarea 
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
              <div className="flex justify-end gap-2 mt-2">
                  <button 
                      onClick={() => { setIsEditing(false); setEditContent(post.content); }}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
                  >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
              </div>
          </div>
      ) : (
          <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">
            {post.content}
            {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className="text-xs text-gray-400 ml-2 italic">(edited)</span>
            )}
          </p>
      )}
      
      {post.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden bg-gray-50 flex justify-center border border-gray-100">
            {post.imageUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video controls className="w-full h-auto max-h-[500px] object-contain bg-black">
                    <source src={post.imageUrl} />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <img 
                    src={post.imageUrl} 
                    alt="Post content" 
                    className="w-full h-auto max-h-[500px] object-contain cursor-pointer hover:opacity-95 transition-opacity" 
                    onClick={() => setFullScreenImage(true)}
                />
            )}
        </div>
      )}

      {/* Full Screen Image Modal */}
      {fullScreenImage && !post.imageUrl.match(/\.(mp4|webm|ogg|mov)$/i) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <button 
                  onClick={() => setFullScreenImage(false)}
                  className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
              >
                  <X size={24} />
              </button>
              <img 
                  src={post.imageUrl} 
                  alt="Full screen" 
                  className="max-w-full max-h-[90vh] object-contain rounded-sm" 
                  onClick={(e) => e.stopPropagation()}
              />
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
            <button 
                onClick={toggleComments}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${showComments ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
            >
                <MessageCircle size={20} />
                <span>{commentCount}</span>
            </button>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 size={20} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
              <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                  <input 
                      type="text" 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-gray-50 text-sm rounded-full px-4 py-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className="text-blue-600 p-2 disabled:opacity-50 hover:bg-blue-50 rounded-full transition-colors"
                  >
                      <Send size={18} />
                  </button>
              </form>

              {loadingComments ? (
                  <div className="text-center py-2 text-gray-500 text-sm">Loading comments...</div>
              ) : comments.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {comments.map((comment) => (
                          <div key={comment._id} className="flex space-x-3 group pr-2">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden">
                                  {comment.userId?.avatarUrl ? (
                                      <img src={comment.userId.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                  ) : (
                                      <span className="text-gray-600">{comment.userId?.name ? comment.userId.name[0] : 'U'}</span>
                                  )}
                              </div>
                              <div className="flex-1">
                                  <div className="bg-gray-50 rounded-2xl px-3 py-2 inline-block">
                                      <p className="font-semibold text-xs text-gray-900">{comment.userId?.name || 'User'}</p>
                                      <p className="text-sm text-gray-800">{comment.content}</p>
                                  </div>
                                  <div className="flex items-center mt-1 ml-2 space-x-3 text-xs text-gray-500">
                                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                      {/* Only show delete option for comment author or post author */}
                                      {user && (comment.userId?._id === user._id || isAuthor) && (
                                          <button 
                                              onClick={() => handleDeleteComment(comment._id)}
                                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                                          >
                                              Delete
                                          </button>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-2 text-gray-500 text-sm">No comments yet.</div>
              )}
          </div>
      )}
    </div>
  );
};

export default PostCard;
