import React, { useState, useEffect } from 'react';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import feedService from '../services/feed.service';
import { Newspaper } from 'lucide-react';

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
            // Ensure data is array, if backend returns object with posts array, use that
            // For now, assuming backend returns array or { posts: [] }
            const postsArray = Array.isArray(data) ? data : (data.posts || []);
            
            // If empty, use mock data for demo purposes since backend might not be ready
            if (postsArray.length === 0) {
                 setPosts(MOCK_POSTS);
            } else {
                 setPosts(postsArray);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
            // Fallback to mock data on error for demo
            setPosts(MOCK_POSTS);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (postData) => {
        setCreatingPost(true);
        try {
            // Optimistic update
            const newPost = {
                id: Date.now(),
                content: postData.content,
                likes: 0,
                comments: 0,
                time: 'Just now',
                user: { name: 'You' },
                ...postData
            };
            
            setPosts([newPost, ...posts]);
            
            // Actual API Call
            await feedService.createPost(postData);
        } catch (error) {
            console.error("Failed to create post", error);
            // Revert on failure? For now just log
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
                <PostCard key={post.id} post={post} />
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

// Fallback Mock Data
const MOCK_POSTS = [
    {
        id: 1,
        user: { name: 'Akinkunmi Tunde' },
        time: 'Just now',
        content: 'Hello, Guys',
        likes: 1,
        comments: 0
    },
    {
        id: 2,
        user: { name: 'Akinkunmi Tunde' },
        time: '10m ago',
        content: "Hi mates❤️ Its a new week, I hope will have the best of it. Let's go guys!!!\nAnd, dont forget to like and share. Thanks❤️",
        likes: 556,
        comments: 12
    },
    {
        id: 3,
        user: { name: 'Sarah Jenkins' },
        time: '1h ago',
        content: "Does anyone have the notes for today's Biology lecture? I missed the first half. 🧬",
        likes: 24,
        comments: 5
    }
];

export default Feed;
