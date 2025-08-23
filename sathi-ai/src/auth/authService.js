import { apiFetch } from "../api/client";

// Uses your curl contract: POST /auth/token { "user_id": "..." }
export async function loginWithUserId(userId) {
  const data = await apiFetch("/auth/token", {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
  sessionStorage.setItem("access_token", data.access_token);
  return data;
}

export function isAuthed() {
  return !!sessionStorage.getItem("access_token");
}

export function logout() {
  sessionStorage.removeItem("access_token");
}
