// Simple REST helpers. If your backend isn't ready yet, the code
// falls back to a tiny in-memory store so the page still works.

const BASE = "http://127.0.0.1:8000/notes";

let memory = [
  {
    id: "5dc963bc-fd42-4c26-9731-a0a397576ae5",
    user_id: "user_123",
    title: "Visa docs",
    content: "Checklist for OPT- TEST",
    tags: ["visa", "todo"],
  },
];

async function tryFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (_) {
    return null; // fall back to memory
  }
}

export async function getNotes(userId, opts = {}) {
  const data = await tryFetch(`${BASE}?user_id=${encodeURIComponent(userId)}`, { signal: opts.signal });
    console.log("data", data);

  if (data) return data;
  // fallback
  return memory.filter(n => n.user_id === userId || userId === "demo-user-1");
}

export async function createNote(note) {
  const data = await tryFetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (data) return data;
  // fallback
  const n = { ...note, id: crypto.randomUUID() };
  memory.unshift(n);
  return n;
}

export async function updateNote(id, patch) {
  const data = await tryFetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (data) return data;
  // fallback
  memory = memory.map(n => (n.id === id ? { ...n, ...patch } : n));
  return memory.find(n => n.id === id);
}

export async function deleteNote(id) {
  const ok = await tryFetch(`${BASE}/${id}`, { method: "DELETE" });
  if (ok !== null) return true;
  // fallback
  memory = memory.filter(n => n.id !== id);
  return true;
}
