const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "hackkit_token";

export type User = { id: number; email: string; role: string; created_at: string };
export type Item = { id: number; title: string; description: string | null; owner_id: number; created_at: string };
export type AuthResponse = { access_token: string; token_type: "bearer"; user: User };

export function getToken() {
  if (typeof window === "undefined") return null;
  // Fast hackathon path: localStorage is easy to wire and debug.
  // Tradeoff: it is more exposed to XSS than an HttpOnly cookie.
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401 && typeof window !== "undefined") {
    clearToken();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  register: (email: string, password: string) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<User>("/auth/me"),
  listItems: () => request<Item[]>("/items"),
  createItem: (payload: Pick<Item, "title" | "description">) =>
    request<Item>("/items", { method: "POST", body: JSON.stringify(payload) }),
  updateItem: (id: number, payload: Partial<Pick<Item, "title" | "description">>) =>
    request<Item>(`/items/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteItem: (id: number) => request<void>(`/items/${id}`, { method: "DELETE" }),
};
