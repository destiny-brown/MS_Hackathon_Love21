const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "hackkit_token";

export type Role = "supporter" | "member" | "admin";
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
  image_url: string | null;
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
export type DonationFrequency = "one_time" | "monthly";
export type Donation = {
  id: number;
  supporter_id: number | null;
  support_opportunity_id: number | null;
  donor_email: string | null;
  donor_name: string | null;
  amount_hkd: number;
  frequency: DonationFrequency;
  status: string;
  payment_reference: string;
  message: string | null;
  created_at: string;
  support_opportunity: SupportOpportunity | null;
};
export type DonationInput = {
  amount_hkd: number;
  frequency: DonationFrequency;
  support_opportunity_id?: number | null;
  donor_email?: string | null;
  donor_name?: string | null;
  message?: string | null;
};
export type DonationReceipt = {
  donation: Donation;
  attributed_to_account: boolean;
  account_prompt: string | null;
};
export type Activity = {
  id: number;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  description: string;
  signed_up: boolean;
};
export type ActivitySignup = {
  id: number;
  supporter_id: number;
  activity_id: number;
  status: string;
  created_at: string;
  activity: Activity;
};
export type VolunteerHour = {
  id: number;
  supporter_id: number;
  activity_id: number | null;
  hours: number;
  notes: string | null;
  logged_at: string;
  activity: Activity | null;
};
export type ImpactItem = {
  title: string;
  amount_hkd: number;
  message: string;
  progress_percent: number;
};
export type SupporterDashboard = {
  donations: Donation[];
  total_given_hkd: number;
  recurring_status: string;
  impact_items: ImpactItem[];
  signed_up_activities: ActivitySignup[];
  volunteer_hours: VolunteerHour[];
  total_volunteer_hours: number;
};
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
export type CaptainToolCall = {
  name: string;
  arguments: Record<string, string>;
};
export type CaptainChatMessage = {
  role: "user" | "assistant";
  content: string;
  links?: CaptainSiteLink[];
  actionNote?: string;
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
  tool_calls: CaptainToolCall[];
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
    case "supporter":
    default:
      return "/supporter/dashboard";
  }
}

type ApiRequestInit = RequestInit & { redirectOnUnauthorized?: boolean };

async function request<T>(path: string, options: ApiRequestInit = {}): Promise<T> {
  const { redirectOnUnauthorized = true, ...requestOptions } = options;
  const token = getToken();
  const headers = new Headers(requestOptions.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...requestOptions, headers });

  if (response.status === 401 && typeof window !== "undefined") {
    clearToken();
    if (redirectOnUnauthorized) window.location.href = "/login";
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
  return api.currentUser();
}

export const api = {
  register: (email: string, password: string, role: Exclude<Role, "admin"> = "supporter") =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ email, password, role }) }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<User>("/auth/me"),
  currentUser: () => request<User>("/auth/me", { redirectOnUnauthorized: false }),
  listItems: () => request<Item[]>("/items"),
  createItem: (payload: Pick<Item, "title" | "description">) =>
    request<Item>("/items", { method: "POST", body: JSON.stringify(payload) }),
  updateItem: (id: number, payload: Partial<Pick<Item, "title" | "description">>) =>
    request<Item>(`/items/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteItem: (id: number) => request<void>(`/items/${id}`),
  adminMetrics: () => request<{ active_members: number; monthly_recurring_donations: number; open_volunteer_roles: number }>("/admin/metrics"),
  recurringDonation: () => request<{ email: string; status: string }>("/supporter/recurring-donation"),
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
  createMockDonation: (payload: DonationInput) =>
    request<DonationReceipt>("/donations/mock", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listActivities: () => request<Activity[]>("/activities"),
  signUpForActivity: (id: number) =>
    request<ActivitySignup>(`/activities/${id}/signup`, { method: "POST", body: JSON.stringify({}) }),
  supporterDashboard: () => request<SupporterDashboard>("/supporter/dashboard"),
  logVolunteerHours: (payload: { activity_id?: number | null; hours: number; notes?: string | null }) =>
    request<VolunteerHour>("/supporter/hours", { method: "POST", body: JSON.stringify(payload) }),
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
