// src/lib/api.js
const API_URL = import.meta.env.VITE_RAG_URL;

export async function sendMessage(text) {
  const r = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: text }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const { answer } = await r.json();
  return answer;
}
