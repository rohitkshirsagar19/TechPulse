// src/components/PostForm.jsx
import { useState } from 'react';
import { useUser } from '../context/UserContext';

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
      addPost({ title, content, author: user.username });
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
          placeholder={`What's on your mind, ${user.username}?`}
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
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Post
      </button>
    </form>
  );
}
export default PostForm;