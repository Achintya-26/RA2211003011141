import { useEffect, useState } from "react";
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
  });

export  default function TopUsers(){
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiClient.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
    <h2 className="text-3xl font-bold mb-4 text-blue-600">Top Users</h2>
    <ul>
      {users.map((user, index) => (
        <li key={index} className="p-4 border rounded mb-2 bg-gray-100">
          <span className="font-semibold">{user.name}</span> - {user.postCount} Posts
        </li>
      ))}
    </ul>
  </div>
  );
};