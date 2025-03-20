const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
require("dotenv").config(); // Load environment variables

const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

const BASE_URL = "http://20.244.56.144/test";
const AUTH_TOKEN = process.env.AUTH_TOKEN; // Bearer token from environment variables

// Axios instance with authentication header
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
});

// Fetch all users
async function fetchUsers() {
    const cacheKey = "users";
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    try {
        const response = await apiClient.get("/users");
        cache.set(cacheKey, response.data.users);
        return response.data.users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
}

// Fetch posts by a user
async function fetchPostsByUser(userId) {
    try {
        const response = await apiClient.get(`/users/${userId}/posts`);
        return response.data.posts || [];
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error);
        return [];
    }
}

// Fetch comments on a post
async function fetchComments(postId) {
    try {
        const response = await apiClient.get(`/posts/${postId}/comments`);
        return response.data.comments || [];
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        return [];
    }
}

// Get top 5 users by number of posts
app.get("/users", async (req, res) => {
    const users = await fetchUsers();
    if (!users) return res.status(500).json({ error: "Failed to fetch users" });

    const postCounts = [];

    await Promise.all(
        Object.entries(users).map(async ([id, name]) => {
            const posts = await fetchPostsByUser(id);
            postCounts.push({ id, name, postCount: posts.length });
        })
    );

    postCounts.sort((a, b) => b.postCount - a.postCount);
    res.json(postCounts.slice(0, 5));
});

// Get latest or popular posts
app.get("/posts", async (req, res) => {
    const { type } = req.query;
    if (!type || !["latest", "popular"].includes(type)) {
        return res.status(400).json({ error: "Invalid type. Use 'latest' or 'popular'." });
    }

    const users = await fetchUsers();
    if (!users) return res.status(500).json({ error: "Failed to fetch users" });

    let allPosts = [];
    await Promise.all(
        Object.keys(users).map(async (userId) => {
            const posts = await fetchPostsByUser(userId);
            allPosts.push(...posts);
        })
    );

    if (type === "latest") {
        allPosts.sort((a, b) => b.id - a.id); // Assuming newer posts have higher IDs
        return res.json(allPosts.slice(0, 5));
    }

    if (type === "popular") {
        const postComments = [];
        await Promise.all(
            allPosts.map(async (post) => {
                const comments = await fetchComments(post.id);
                postComments.push({ ...post, commentCount: comments.length });
            })
        );

        postComments.sort((a, b) => b.commentCount - a.commentCount);
        return res.json(postComments.filter(post => post.commentCount > 0));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
