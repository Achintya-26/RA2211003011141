import { useEffect, useState } from "react";
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
  });



export default function Feed ()  {
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      const fetchFeed = async () => {
        const res = await apiClient.get("/posts?type=latest");
        setPosts(res.data);
      };
      fetchFeed();
      const interval = setInterval(fetchFeed, 5000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-green-600">Live Feed</h2>
      <ul>
        {posts.map((post, index) => (
          <li key={index} className="p-4 border rounded mb-2 bg-gray-100">
            <span className="font-semibold">{post.title}</span>
          </li>
        ))}
      </ul>
    </div>
    );
  };