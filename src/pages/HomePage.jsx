// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch posts
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((postResponse) => {
        const fetchedPosts = postResponse.data.slice(0, 5).map((post) => ({
          id: post.id,
          title: post.title,
          content: post.body,
          likes: 0,
          author: `User${post.userId}`,
          comments: [], // Initialize empty; we’ll add comments next
        }));

        // Fetch comments for all posts
        axios
          .get('https://jsonplaceholder.typicode.com/comments')
          .then((commentResponse) => {
            const fetchedComments = commentResponse.data;
            // Add comments to corresponding posts
            const postsWithComments = fetchedPosts.map((post) => ({
              ...post,
              comments: fetchedComments
                .filter((comment) => comment.postId === post.id)
                .map((comment) => ({
                  text: comment.body,
                  author: comment.email.split('@')[0], // Use email prefix as author
                })),
            }));
            setPosts(postsWithComments);
            setLoading(false);
          })
          .catch((err) => {
            setError('Failed to load comments');
            setLoading(false);
          });
      })
      .catch((err) => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const addPost = (newPost) => {
    console.log('Add post:', newPost);
  };

  const addComment = (postId, comment) => {
    console.log('Add comment:', comment, 'to post:', postId);
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
      {/* <PostForm addPost={addPost} /> */} 
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