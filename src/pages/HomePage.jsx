// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useUser } from '../context/UserContext';

function HomePage() {
  const { token } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/posts')
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, []);

  const handleLike = async (postId) => {
    if (!token) {
      setError('Please log in to like posts');
      return;
    }
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

  const addPost = async (newPost) => {
    if (!token) {
      setError('Please log in to post');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:3001/api/posts',
        {
          id: posts.length + 1,
          title: newPost.title,
          content: newPost.content,
          likes: 0,
          author: newPost.author,
          comments: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts([...posts, response.data]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add post');
    }
  };

  const addComment = async (postId, comment) => {
    if (!token) {
      setError('Please log in to comment');
      return;
    }
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

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">TechPulse Feed</h1>
      <PostForm addPost={addPost} />
      {posts.map((post) => (
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
      ))}
    </div>
  );
}
export default HomePage;