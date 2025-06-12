// src/components/CommentForm.jsx
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import DOMPurify from 'dompurify';

function CommentForm({ onComment }) {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to comment');
      return;
    }
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError('');
    const sanitizedComment = {
      text: DOMPurify.sanitize(comment, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] }),
      author: user.username,
    };
    onComment(sanitizedComment);
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
          placeholder={user ? `Comment as ${user.username}...` : 'Please log in to comment'}
          disabled={!user}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!user}
        >
          Comment
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
}
export default CommentForm;