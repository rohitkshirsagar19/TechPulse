// src/components/PostForm.jsx
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import DOMPurify from 'dompurify';

function PostForm({ addPost }) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { title: '', content: '' };

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      hasError = true;
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      const sanitizedPost = {
        title: DOMPurify.sanitize(title, { ALLOWED_TAGS: [] }),
        content: DOMPurify.sanitize(content, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] }),
        author: user?.username || 'Anonymous',
      };
      addPost(sanitizedPost);
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 m-4 rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
          Post Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`border rounded w-full py-2 px-3 text-gray-700 ${errors.title ? 'border-red-500' : ''}`}
          placeholder={user ? `What's on your mind, ${user.username}?` : 'Please log in to post'}
          disabled={!user}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`border rounded w-full py-2 px-3 text-gray-700 ${errors.content ? 'border-red-500' : ''}`}
          placeholder="Share your thoughts..."
          disabled={!user}
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        disabled={!user}
      >
        Post
      </button>
    </form>
  );
}
export default PostForm;