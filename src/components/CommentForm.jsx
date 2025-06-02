// src/components/CommentForm.jsx
import { useState } from 'react';

function CommentForm({ onComment }) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700"
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Comment
        </button>
      </div>
    </form>
  );
}
export default CommentForm;