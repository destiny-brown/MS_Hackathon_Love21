const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "hackkit_token";

export type Role = "donor" | "volunteer" | "member" | "admin";
export type User = { id: number; email: string; role: Role; created_at: string };
export type Item = { id: number; title: string; description: string | null; owner_id: number; created_at: string };
export type AuthResponse = { access_token: string; token_type: "bearer"; user: User };
export type OpportunityKind = "campaign" | "cause" | "wishlist";
export type OpportunityStatus = "active" | "archived";
export type SupportOpportunity = {
  id: number;
  slug: string;
  kind: OpportunityKind;
  title: string;
  description: string;
  impact_statement: string;
  target_amount_hkd: number;
  funded_amount_hkd: number;
  moonclerk_url: string | null;
  purchase_url: string | null;
  quantity_needed: number | null;
  quantity_secured: number | null;
  status: OpportunityStatus;
  display_order: number;
  progress_percent: number;
  created_at: string;
  updated_at: string;
};
export type SupportOpportunityInput = Omit<
  SupportOpportunity,
  "id" | "slug" | "progress_percent" | "created_at" | "updated_at"
>;
export type YouTubeVideo = {
  video_id: string;
  title: string;
  channel_title: string;
  published_at: string;
  thumbnail_url: string | null;
};
export type YouTubeSearchResponse = { enabled: boolean; items: YouTubeVideo[]; error: string | null };
export type VolunteerMatchRequest = {
  interest: "hands-on" | "food" | "people" | "skills";
  availability: "weekday-am" | "weekday-pm" | "weekend-am" | "flexible";
  commitment: "one-off" | "weekly" | "long-term";
  group_size: "solo" | "friend" | "team";
};
export type VolunteerMatchItem = {
  role_id: string;
  icon: string;
  title: string;
  desc: string;
  when: string;
  where: string;
  category: string;
  score: number;
  reasons: string[];
};
export type VolunteerMatchResponse = {
  enabled: boolean;
  ai_enhanced: boolean;
  matches: VolunteerMatchItem[];
  message: string | null;
};
export type VolunteerActivity = {
  role_id: string;
  icon: string;
  title: string;
  desc: string;
  when: string;
  where: string;
  category: string;
  filled?: number | null;
  total?: number | null;
  note?: string | null;
  cta_label?: string;
};
export type TrailDebriefRequest = {
  captain_name?: string;
  stop_title: string;
  ability_line: string;
  sections_completed: number;
  trail_streak: number;
  myth_completed_today: boolean;
  myth_won_today: boolean;
  myth_statement?: string;
};
export type TrailDebriefResponse = {
  enabled: boolean;
  ai_enhanced: boolean;
  encouragement: string;
  friend_prompt: string;
  suggested_replies: string[];
  upgrade_message: string;
  message: string | null;
};
export type CaptainSiteLink = {
  title: string;
  href: string;
  description: string;
};
export type CaptainChatMessage = {
  role: "user" | "assistant";
  content: string;
  links?: CaptainSiteLink[];
};
export type CaptainChatRequest = {
  message: string;
  history?: CaptainChatMessage[];
  locale?: "en" | "yue" | "zh";
};
export type CaptainChatResponse = {
  enabled: boolean;
  reply: string;
  links: CaptainSiteLink[];
  sources: string[];
  message: string | null;
};

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

export function landingPathForRole(role: Role) {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "member":
      return "/member/profile";
    case "volunteer":
      return "/volunteer/portal";
    case "donor":
    default:
      return "/donor/portal";
  }
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

export async function getCurrentUserWithRole() {
  if (!getToken()) return null;
  return api.me();
}

export const api = {
  register: (email: string, password: string, role: Exclude<Role, "admin"> = "donor") =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ email, password, role }) }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<User>("/auth/me"),
  listItems: () => request<Item[]>("/items"),
  createItem: (payload: Pick<Item, "title" | "description">) =>
    request<Item>("/items", { method: "POST", body: JSON.stringify(payload) }),
  updateItem: (id: number, payload: Partial<Pick<Item, "title" | "description">>) =>
    request<Item>(`/items/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteItem: (id: number) => request<void>(`/items/${id}`),
  adminMetrics: () => request<{ active_members: number; monthly_recurring_donations: number; open_volunteer_roles: number }>("/admin/metrics"),
  recurringDonation: () => request<{ email: string; status: string }>("/donor/recurring-donation"),
  memberProfile: () => request<{ email: string; profile_status: string }>("/member/profile"),
  listSupportOpportunities: (kind?: OpportunityKind) =>
    request<SupportOpportunity[]>(`/support-opportunities${kind ? `?kind=${kind}` : ""}`),
  listAdminSupportOpportunities: () => request<SupportOpportunity[]>("/support-opportunities/admin"),
  createSupportOpportunity: (payload: SupportOpportunityInput) =>
    request<SupportOpportunity>("/support-opportunities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateSupportOpportunity: (id: number, payload: Partial<SupportOpportunityInput>) =>
    request<SupportOpportunity>(`/support-opportunities/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  searchYouTube: (query: string, maxResults = 20, maxDurationMinutes = 5) =>
    request<YouTubeSearchResponse>(
      `/ai/youtube/search?q=${encodeURIComponent(query)}&max_results=${encodeURIComponent(String(maxResults))}&max_duration_minutes=${encodeURIComponent(String(maxDurationMinutes))}`,
    ),
  matchVolunteer: (payload: VolunteerMatchRequest) =>
    request<VolunteerMatchResponse>("/ai/volunteer/match", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listVolunteerActivities: () => request<VolunteerActivity[]>("/ai/volunteer/activities"),
  trailDebrief: (payload: TrailDebriefRequest) =>
    request<TrailDebriefResponse>("/ai/trail/debrief", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  captainChat: (payload: CaptainChatRequest) =>
    request<CaptainChatResponse>("/ai/captain/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
