// src/components/CommentForm.jsx
import { useState } from 'react';
import { useUser } from '../context/UserContext';

function CommentForm({ onComment }) {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError('');
    onComment({ text: comment, author: user.username });
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`border rounded w-full py-2 px-3 text-gray-700 ${error ? 'border-red-500' : ''}`}
          placeholder={`Comment as ${user.username}...`}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Comment
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
}
export default CommentForm;