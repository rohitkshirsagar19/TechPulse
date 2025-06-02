function PostCard({title, content, likes, author, onLike}) {
    return (
        <div className="border border-gray-300 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-500 text-sm">Posted by {author}</p>
            <p className="text-gray-700">{content}</p>
            <div className="flex gap-2 mt-2">
                <button 
                onClick={onLike}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    Like ({likes})
                </button>
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition">
                    Comment
                </button>

            </div>
        </div>
    )
}

export default PostCard;
