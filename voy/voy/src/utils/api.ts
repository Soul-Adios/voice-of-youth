// src/utils/api.ts
const API_BASE = "http://localhost:8000/api";

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts/`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function createPost(message: string, category: string) {
  const res = await fetch(`${API_BASE}/posts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, category }),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function upvotePost(id: number) {
  const res = await fetch(`${API_BASE}/upvote/${id}/`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to upvote");
  return res.json();
}
