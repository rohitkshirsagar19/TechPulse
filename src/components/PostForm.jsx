// src/components/PostForm.jsx
import { useState } from 'react';

function PostForm({ addPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
    if (title && content) {
      addPost({ title, content });
      setTitle(''); // Clear form
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
          className="border rounded w-full py-2 px-3 text-gray-700"
          placeholder="Enter post title"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700"
          placeholder="What's on your mind?"
        />
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