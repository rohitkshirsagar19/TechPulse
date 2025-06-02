import { useState } from "react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

function HomePage() {

    // Mock data for posts
    const [posts , setPosts] = useState ([
       {
      id: 1,
      title: 'Learning React',
      content: 'React is awesome for building UIs! 🚀',
      likes: 5,
      author: 'TechGuru',
      comments: [], // Initialize with an empty array for comments
    },
    {
      id: 2,
      title: 'JavaScript Tips',
      content: 'Use arrow functions for cleaner code.',
      likes: 3,
      author: 'CodeMaster',
      comments: [], // Initialize with an empty array for comments
    },
    ])

    // Function to handle like button click
    const handleLike = (postID) => {
        setPosts(posts.map(post => {
            if (post.id === postID) {
                return { ...post, likes: post.likes + 1 };
            }
            return post;
        }

        ))
    }

    // Function to add a new post
    const addPost = (newPost) => {
        setPosts([
            ...posts,
            {
                id: posts.length + 1,
                title: newPost.title,
                content: newPost.content,       
                likes: 0,
                author: newPost.author,
                comments: [], // Placeholder for author
            }
        ])
    }

    // Function to add comments 
    const addComment = (postID,comment) => {
        setPosts(posts.map(post =>
            post.id === postID ? {...post,comments : [...post.comments,comment ]} : post
        ));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">TechPulse Feed</h1>
            <PostForm addPost={addPost} />
            {
                posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        title={post.title} 
                        content={post.content} 
                        likes={post.likes} 
                        author={post.author}
                        comments={post.comments}
                        onLike={() => handleLike(post.id)}
                        onComment={(comment) => addComment(post.id, comment)} 
                    />
                ))
            }
        </div>
    )
}

export default HomePage;