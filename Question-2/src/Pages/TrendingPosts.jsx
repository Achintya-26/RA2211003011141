import { useEffect, useState } from "react";
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
  });

export default function TrendingPosts () {
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      apiClient.get("/posts?type=popular").then((res) => setPosts(res.data));
    }, []);
  
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-red-600">Trending Posts</h2>
      <ul>
        {posts.map((post, index) => (
          <li key={index} className="p-4 border rounded mb-2 bg-gray-100">
            <span className="font-semibold">{post.title}</span> - {post.commentCount} Comments
          </li>
        ))}
      </ul>
    </div>
    );
  };