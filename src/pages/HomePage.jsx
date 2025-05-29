import { useState } from "react";
import PostCard from "../components/PostCard";

function HomePage() {

    // Mock data for posts
    const [posts , setPosts] = useState ([
       {
      id: 1,
      title: 'Learning React',
      content: 'React is awesome for building UIs! 🚀',
      likes: 5,
      author: 'TechGuru',
    },
    {
      id: 2,
      title: 'JavaScript Tips',
      content: 'Use arrow functions for cleaner code.',
      likes: 3,
      author: 'CodeMaster',
    },
    ])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">TechPulse Feed</h1>
            {
                posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        title={post.title} 
                        content={post.content} 
                        likes={post.likes} 
                        author={post.author} 
                    />
                ))
            }
        </div>
    )
}

export default HomePage;