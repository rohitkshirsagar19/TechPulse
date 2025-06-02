// src/components/PostCard.jsx
import CommentForm from './CommentForm';

function PostCard({
  title,
  content,
  likes,
  author,
  comments = [],      // <-- Default value added here
  onLike,
  onComment
}) {
  return (
    <div className="border border-gray-300 p-4 m-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm">Posted by {author}</p>
      <p className="text-gray-700">{content}</p>
      <div className="flex gap-2 mt-2">
        <button 
          onClick={onLike} 
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Like ({likes})
        </button>
        <button className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600">
          Comment ({comments.length})
        </button>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold">Comments</h4>
        {comments.length > 0 ? (
          <ul className="list-disc pl-5">
            {comments.map((comment, index) => (
              <li key={index} className="text-gray-600">{comment}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
        <CommentForm onComment={onComment} />
      </div>
    </div>
  );
}

export default PostCard;
