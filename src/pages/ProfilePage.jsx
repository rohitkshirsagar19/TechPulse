// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import PostCard from '../components/PostCard';

function ProfilePage() {
  const { user, token } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    axios
      .get('http://localhost:3001/api/posts')
      .then((response) => {
        const userPosts = response.data.filter((post) => post.author === user.username);
        setPosts(userPosts);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, [user]);

  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      const updatedPost = { ...post, likes: post.likes + 1 };
      const response = await axios.put(
        `http://localhost:3001/api/posts/${postId}`,
        updatedPost,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(posts.map((p) => (p.id === postId ? response.data : p)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to like post');
    }
  };

  const addComment = async (postId, comment) => {
    try {
      const post = posts.find((p) => p.id === postId);
      const updatedComments = [
        ...post.comments,
        { id: post.comments.length + 1, text: comment.text, author: comment.author },
      ];
      const response = await axios.put(
        `http://localhost:3001/api/posts/${postId}`,
        {
          ...post,
          comments: updatedComments,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(posts.map((p) => (p.id === postId ? response.data : p)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  if (!user) {
    return <div className="container mx-auto p-4 text-red-500">Please log in</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{user.username}'s Profile</h1>
      <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            content={post.content}
            likes={post.likes}
            author={post.author}
            comments={post.comments}
            onLike={() => handleLike(post.id)}
            onComment={(comment) => addComment(post.id, comment)}
          />
        ))
      ) : (
        <p className="text-gray-500">You haven't posted anything yet.</p>
      )}
    </div>
  );
}
export default ProfilePage;