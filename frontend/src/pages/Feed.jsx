import React, { useState, useEffect } from 'react';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import feedService from '../services/feed.service';
import { Newspaper } from 'lucide-react';
import toast from 'react-hot-toast';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingPost, setCreatingPost] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await feedService.getPosts();
            const postsArray = Array.isArray(data) ? data : (data.posts || []);
            setPosts(postsArray);
        } catch (error) {
            console.error("Failed to fetch posts", error);
            toast.error("Failed to load feed");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (postData) => {
        setCreatingPost(true);
        try {
            await feedService.createPost(postData);
            // Refresh posts after create rather than optimistic string to get real IDs & dates
            await fetchPosts();
        } catch (error) {
            console.error("Failed to create post", error);
            toast.error("Failed to create post");
        } finally {
            setCreatingPost(false);
        }
    };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <CreatePost onPost={handleCreatePost} isPosting={creatingPost} />
      
      {loading ? (
        <div className="py-20">
            <Loader size="lg" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard 
                    key={post._id || post.id} 
                    post={post} 
                    onDelete={(deletedId) => setPosts(posts.filter(p => (p._id || p.id) !== deletedId))}
                    onEdit={(updatedPost) => setPosts(posts.map(p => (p._id || p.id) === (updatedPost._id || updatedPost.id) ? { ...p, ...updatedPost } : p))}
                />
            ))}
        </div>
      ) : (
        <EmptyState 
            icon={Newspaper} 
            title="No posts yet" 
            description="Be the first to share something with your campus!" 
        />
      )}
    </div>
  );
};

export default Feed;
