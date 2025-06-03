// src/components/PostCard.jsx
import { useState } from 'react';
import CommentForm from './CommentForm';

function PostCard({ title, content, likes, author, comments, onLike, onComment }) {
  const [showCommentForm, setShowCommentForm] = useState(false);

  return (
    <div className="border border-gray-300 p-4 m-4 rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 text-sm">Posted by {author}</p>
      <p className="text-gray-700 mt-2">{content}</p>
      <div className="flex gap-2 mt-3">
        <button 
          onClick={onLike} 
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
        >
          Like ({likes})
        </button>
        <button 
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 transition"
        >
          {showCommentForm ? 'Hide Comment Form' : `Comment (${comments.length})`}
        </button>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700">Comments</h4>
        {comments.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {comments.map((comment, index) => (
              <li key={index} className="border-l-2 border-gray-200 pl-3 text-gray-600">
                <span className="font-medium text-gray-800">{comment.author}:</span> {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
        {showCommentForm && <CommentForm onComment={onComment} />}
      </div>
    </div>
  );
}
export default PostCard;