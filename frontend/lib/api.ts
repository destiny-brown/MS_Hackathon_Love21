const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "hackkit_token";
const REFRESH_TOKEN_KEY = "hackkit_refresh_token";

export type Role = "supporter" | "member" | "admin";
export type User = {
  id: number;
  email: string;
  role: Role;
  created_at: string;
};
export type Item = {
  id: number;
  title: string;
  description: string | null;
  owner_id: number;
  created_at: string;
};
export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  user: User;
};
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
export type UserPlayState = {
  day_number: number;
  event_index: number;
  correct_count: number;
  total_answered: number;
  current_streak: number;
  best_streak: number;
  total_plays: number;
  location_id: string;
  location_label: string;
  events_total: number;
  events_remaining: number;
  last_played_at: string | null;
  updated_at: string;
};
export type UserPlayStateUpdate = {
  day_number: number;
  event_index: number;
  correct_count: number;
  total_answered: number;
  current_streak: number;
  best_streak: number;
  total_plays: number;
};
export type CaptainsCorner = {
  play_state: UserPlayState;
  captain_message: string;
  ai_enhanced: boolean;
};
export type YouTubeVideo = {
  video_id: string;
  title: string;
  channel_title: string;
  published_at: string;
  thumbnail_url: string | null;
};
export type GratitudeEntryStatus = "pending" | "approved" | "rejected";
export type GratitudeEntry = {
  id: number;
  author_id: number;
  display_name: string | null;
  message: string;
  photo_url: string | null;
  status: GratitudeEntryStatus | string;
  submitted_at: string;
  moderated_at: string | null;
  moderator_id: number | null;
};
export type GratitudeEntryInput = {
  display_name?: string | null;
  message: string;
  photo_url?: string | null;
};
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
  signed_up: boolean;
};
export type VolunteerActivityRegistration = {
  id: number;
  user_id: number;
  activity_id: number;
  activity_slug: string;
  activity_name: string;
  status: string;
  created_at: string;
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
export type AdminActivity = {
  id: number;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  description: string;
  max_capacity: number | null;
  category: string | null;
  status: string;
  registration_count: number;
  created_at: string;
};
export type AdminVolunteerActivity = {
  id: number;
  slug: string;
  icon: string;
  title: string;
  description: string;
  schedule_label: string;
  location_label: string;
  category: string;
  filled_count: number | null;
  total_spots: number | null;
  note: string | null;
  cta_label: string;
  status: string;
  display_order: number;
  created_at: string;
};
export type AdminVolunteerActivityRegistration = {
  id: number;
  user_id: number;
  user_email: string;
  user_role: Role;
  activity_id: number;
  activity_slug: string;
  activity_name: string;
  status: string;
  created_at: string;
};
export type NewsletterFrequency = "weekly" | "monthly";
export type NewsletterCadence = "weekly" | "monthly";
export type NewsletterSubscriber = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  status: string;
  frequency: NewsletterFrequency;
  subscribed_at: string;
};
export type NewsletterDelivery = {
  id: number;
  subject: string;
  content_text: string;
  recipient_count: number;
  cadence: string | null;
  recipient_groups: string | null;
  sent_at: string;
};
export type NewsletterGenerateResponse = {
  enabled: boolean;
  subject: string;
  content: string;
  cadence: NewsletterCadence;
  sources: {
    events: Array<Record<string, string>>;
    volunteer_programmes: Array<Record<string, string>>;
    community_voices: Array<Record<string, string>>;
    member_stories: Array<Record<string, string>>;
  };
  notice?: string | null;
};
export type AdminOverview = {
  event_count: number;
  volunteer_program_count: number;
  subscriber_count: number;
  active_subscriber_count: number;
  learn_question_count: number;
  learn_resource_count: number;
  learn_video_count: number;
};
export type LearnContentStatus = "draft" | "published" | "archived";
export type LearnQuestionKind = "quiz" | "daily" | "trail";
export type LearnQuestion = {
  id: number;
  external_id: string | null;
  kind: LearnQuestionKind | string;
  status: LearnContentStatus | string;
  statement: string;
  answer: string;
  explanation: string;
  hint: string | null;
  topic: string | null;
  question_type: string | null;
  options_json: Record<string, unknown>[] | null;
  image_url: string | null;
  image_credit: string | null;
  source: string | null;
  related_story_slugs: string[];
  audience: string;
  display_order: number;
  trail_location_id: string | null;
  created_at: string;
  updated_at: string;
};
export type LearnQuestionInput = {
  external_id?: string | null;
  kind?: string;
  status?: string;
  statement: string;
  answer: string;
  explanation: string;
  hint?: string | null;
  topic?: string | null;
  question_type?: string | null;
  options_json?: Record<string, unknown>[] | null;
  image_url?: string | null;
  image_credit?: string | null;
  source?: string | null;
  related_story_slugs?: string[];
  audience?: string;
  display_order?: number;
  trail_location_id?: string | null;
};
export type LearnQuestionGenerateRequest = {
  topic: string;
  count?: number;
  kind?: string;
  guidance?: string | null;
};
export type LearnQuestionGenerateResponse = {
  enabled: boolean;
  message: string | null;
  questions: LearnQuestion[];
};
export type LearnResource = {
  id: number;
  slug: string;
  title: string;
  date_label: string;
  cover_image_url: string;
  source_url: string;
  source_label: string;
  topics: string[];
  learning_hook: string;
  audience: string;
  resource_type: string;
  origin: string;
  show_on_learn: boolean;
  show_on_stories: boolean;
  status: LearnContentStatus | string;
  display_order: number;
  created_at: string;
  updated_at: string;
};
export type LearnResourceInput = {
  slug: string;
  title: string;
  date_label: string;
  cover_image_url: string;
  source_url: string;
  source_label: string;
  topics?: string[];
  learning_hook: string;
  audience?: string;
  resource_type?: string;
  origin?: string;
  show_on_learn?: boolean;
  show_on_stories?: boolean;
  status?: string;
  display_order?: number;
};
export type LearnVideo = {
  id: number;
  video_id: string;
  title: string;
  channel_title: string;
  published_at: string;
  thumbnail_url: string | null;
  status: LearnContentStatus | string;
  display_order: number;
  created_at: string;
  updated_at: string;
};
export type LearnVideoInput = {
  video_id: string;
  title: string;
  channel_title: string;
  published_at: string;
  thumbnail_url?: string | null;
  status?: string;
  display_order?: number;
};

export function getToken() {
  if (typeof window === "undefined") return null;
  // Access token in localStorage for this hackathon build.
  // Prefer HttpOnly cookies + in-memory access tokens for production hardening.
  return window.localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setSessionTokens(accessToken: string, refreshToken: string) {
  window.localStorage.setItem(TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/** @deprecated Use setSessionTokens after login/register. */
export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!response.ok) return false;
        const data = (await response.json()) as AuthResponse;
        setSessionTokens(data.access_token, data.refresh_token);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

export function landingPathForRole(role: Role) {
  switch (role) {
    case "admin":
      return "/admin";
    case "member":
      return "/member/profile";
    case "supporter":
    default:
      return "/supporter/dashboard";
  }
}

export function resolvePostLoginPath(role: Role, nextPath: string | null) {
  if (
    nextPath &&
    nextPath.startsWith("/") &&
    !nextPath.startsWith("//") &&
    nextPath !== "/login"
  ) {
    return nextPath;
  }
  return landingPathForRole(role);
}

type ApiRequestInit = RequestInit & {
  redirectOnUnauthorized?: boolean;
  _retried?: boolean;
};

function parseApiError(data: unknown, status: number): string {
  if (typeof data === "object" && data !== null && "detail" in data) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const messages = detail
        .map((entry) =>
          typeof entry === "object" && entry !== null && "msg" in entry
            ? String(entry.msg)
            : "",
        )
        .filter(Boolean);
      if (messages.length > 0) return messages.join(", ");
    }
  }
  return `Request failed: ${status}`;
}

async function request<T>(
  path: string,
  options: ApiRequestInit = {},
): Promise<T> {
  const { redirectOnUnauthorized = true, _retried = false, ...requestOptions } = options;
  const token = getToken();
  const headers = new Headers(requestOptions.headers);
  headers.set("Content-Type", "application/json");
  const isPublicAuthRequest =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/refresh";
  if (token && !isPublicAuthRequest)
    headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = parseApiError(data, response.status);

    if (
      response.status === 401 &&
      typeof window !== "undefined" &&
      !isPublicAuthRequest &&
      !_retried
    ) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return request<T>(path, {
          ...options,
          _retried: true,
        });
      }
    }

    if (response.status === 401 && typeof window !== "undefined") {
      clearToken();
      if (redirectOnUnauthorized) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getCurrentUserWithRole() {
  if (!getToken()) return null;
  return api.currentUser();
}

export const api = {
  register: (
    email: string,
    password: string,
    role: Exclude<Role, "admin"> = "supporter",
  ) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
      redirectOnUnauthorized: false,
    }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      redirectOnUnauthorized: false,
    }),
  refreshSession: (refreshToken: string) =>
    request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      redirectOnUnauthorized: false,
    }),
  logout: (refreshToken: string) =>
    request<void>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      redirectOnUnauthorized: false,
    }),
  me: () => request<User>("/auth/me"),
  currentUser: () =>
    request<User>("/auth/me", { redirectOnUnauthorized: false }),
  listItems: () => request<Item[]>("/items"),
  createItem: (payload: Pick<Item, "title" | "description">) =>
    request<Item>("/items", { method: "POST", body: JSON.stringify(payload) }),
  updateItem: (
    id: number,
    payload: Partial<Pick<Item, "title" | "description">>,
  ) =>
    request<Item>(`/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteItem: (id: number) => request<void>(`/items/${id}`),
  adminMetrics: () =>
    request<{
      active_members: number;
      monthly_recurring_donations: number;
      open_volunteer_roles: number;
    }>("/admin/metrics"),
  recurringDonation: () =>
    request<{ email: string; status: string }>("/supporter/recurring-donation"),
  memberProfile: () =>
    request<{ email: string; profile_status: string }>("/member/profile"),
  listPublicGratitudeEntries: () =>
    request<GratitudeEntry[]>("/gratitude-entries/public"),
  submitGratitudeEntry: (payload: GratitudeEntryInput) =>
    request<GratitudeEntry>("/gratitude-entries/member", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listPendingGratitudeEntries: () =>
    request<GratitudeEntry[]>("/gratitude-entries/admin/pending"),
  listAdminGratitudeEntries: () =>
    request<GratitudeEntry[]>("/gratitude-entries/admin"),
  moderateGratitudeEntry: (id: number, status: "approved" | "rejected") =>
    request<GratitudeEntry>(`/gratitude-entries/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  listSupportOpportunities: (kind?: OpportunityKind) =>
    request<SupportOpportunity[]>(
      `/support-opportunities${kind ? `?kind=${kind}` : ""}`,
    ),
  listAdminSupportOpportunities: () =>
    request<SupportOpportunity[]>("/support-opportunities/admin"),
  createSupportOpportunity: (payload: SupportOpportunityInput) =>
    request<SupportOpportunity>("/support-opportunities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateSupportOpportunity: (
    id: number,
    payload: Partial<SupportOpportunityInput>,
  ) =>
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
    request<ActivitySignup>(`/activities/${id}/signup`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  supporterDashboard: () => request<SupporterDashboard>("/supporter/dashboard"),
  getCaptainsCorner: () => request<CaptainsCorner>("/supporter/captains-corner"),
  getSupporterPlayState: () => request<UserPlayState>("/supporter/play-state"),
  saveSupporterPlayState: (payload: UserPlayStateUpdate) =>
    request<UserPlayState>("/supporter/play-state", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  logVolunteerHours: (payload: {
    activity_id?: number | null;
    hours: number;
    notes?: string | null;
  }) =>
    request<VolunteerHour>("/supporter/hours", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  matchVolunteer: (payload: VolunteerMatchRequest) =>
    request<VolunteerMatchResponse>("/ai/volunteer/match", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listVolunteerActivities: () =>
    request<VolunteerActivity[]>("/ai/volunteer/activities"),
  signUpForVolunteerActivity: (slug: string) =>
    request<VolunteerActivityRegistration>(
      `/ai/volunteer/activities/${slug}/signup`,
      { method: "POST", body: JSON.stringify({}) },
    ),
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
  adminOverview: () => request<AdminOverview>("/admin/overview"),
  listAdminActivities: () => request<AdminActivity[]>("/admin/activities"),
  createAdminActivity: (
    payload: Omit<AdminActivity, "id" | "registration_count" | "created_at">,
  ) =>
    request<AdminActivity>("/admin/activities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminActivity: (
    id: number,
    payload: Partial<
      Omit<AdminActivity, "id" | "registration_count" | "created_at">
    >,
  ) =>
    request<AdminActivity>(`/admin/activities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteAdminActivity: (id: number) =>
    request<void>(`/admin/activities/${id}`, { method: "DELETE" }),
  listAdminVolunteerActivities: () =>
    request<AdminVolunteerActivity[]>("/admin/volunteer-activities"),
  listAdminVolunteerActivityRegistrations: () =>
    request<AdminVolunteerActivityRegistration[]>("/admin/volunteer-activity-registrations"),
  createAdminVolunteerActivity: (
    payload: Omit<AdminVolunteerActivity, "id" | "created_at">,
  ) =>
    request<AdminVolunteerActivity>("/admin/volunteer-activities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminVolunteerActivity: (
    id: number,
    payload: Partial<Omit<AdminVolunteerActivity, "id" | "created_at">>,
  ) =>
    request<AdminVolunteerActivity>(`/admin/volunteer-activities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteAdminVolunteerActivity: (id: number) =>
    request<void>(`/admin/volunteer-activities/${id}`, { method: "DELETE" }),
  listNewsletterSubscribers: () =>
    request<NewsletterSubscriber[]>("/admin/newsletter/subscribers"),
  createNewsletterSubscriber: (payload: Omit<NewsletterSubscriber, "id" | "subscribed_at">) =>
    request<NewsletterSubscriber>("/admin/newsletter/subscribers", {
      method: "POST",
      body: JSON.stringify({
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        phone_number: payload.phone_number,
        status: payload.status,
        frequency: payload.frequency,
      }),
    }),
  updateNewsletterSubscriber: (id: number, payload: Partial<Omit<NewsletterSubscriber, "id" | "subscribed_at">>) =>
    request<NewsletterSubscriber>(`/admin/newsletter/subscribers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        phone_number: payload.phone_number,
        status: payload.status,
        frequency: payload.frequency,
      }),
    }),
  deleteNewsletterSubscriber: (id: number) =>
    request<void>(`/admin/newsletter/subscribers/${id}`, { method: "DELETE" }),
  listNewsletterDeliveries: () =>
    request<NewsletterDelivery[]>("/admin/newsletter/deliveries"),
  previewNewsletter: (payload: {
    subject: string;
    content: string;
    unsubscribe_url?: string;
  }) =>
    request<{ html: string }>("/admin/newsletter/preview", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  generateNewsletter: (payload: { cadence: NewsletterCadence; guidance?: string | null }) =>
    request<NewsletterGenerateResponse>("/admin/newsletter/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  sendNewsletter: (payload: {
    subject: string;
    content: string;
    cadence?: NewsletterCadence | null;
    recipient_groups: NewsletterFrequency[];
  }) =>
    request<{ success: boolean; message: string; sent_count: number }>(
      "/admin/newsletter/send",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),
  subscribeNewsletter: (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    frequency?: NewsletterFrequency;
  }) =>
    request<NewsletterSubscriber>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  unsubscribeNewsletter: (token: string) =>
    request<{ email: string; status: string; message: string }>(
      `/newsletter/unsubscribe/${token}`,
      { method: "POST" },
    ),
  listPublishedLearnQuestions: (kind?: string) =>
    request<LearnQuestion[]>(`/learn/questions${kind ? `?kind=${kind}` : ""}`),
  listPublishedLearnResources: (audience?: string) =>
    request<LearnResource[]>(
      `/learn/resources${audience ? `?audience=${audience}` : ""}`,
    ),
  listPublishedLearnVideos: () => request<LearnVideo[]>("/learn/videos"),
  listAdminLearnQuestions: (params?: { status?: string; kind?: string }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.kind) search.set("kind", params.kind);
    const query = search.toString();
    return request<LearnQuestion[]>(
      `/admin/learn/questions${query ? `?${query}` : ""}`,
    );
  },
  createAdminLearnQuestion: (payload: LearnQuestionInput) =>
    request<LearnQuestion>("/admin/learn/questions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminLearnQuestion: (
    id: number,
    payload: Partial<LearnQuestionInput>,
  ) =>
    request<LearnQuestion>(`/admin/learn/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteAdminLearnQuestion: (id: number) =>
    request<void>(`/admin/learn/questions/${id}`, { method: "DELETE" }),
  generateAdminLearnQuestions: (payload: LearnQuestionGenerateRequest) =>
    request<LearnQuestionGenerateResponse>("/admin/learn/questions/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listAdminLearnResources: () =>
    request<LearnResource[]>("/admin/learn/resources"),
  createAdminLearnResource: (payload: LearnResourceInput) =>
    request<LearnResource>("/admin/learn/resources", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminLearnResource: (
    id: number,
    payload: Partial<LearnResourceInput>,
  ) =>
    request<LearnResource>(`/admin/learn/resources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteAdminLearnResource: (id: number) =>
    request<void>(`/admin/learn/resources/${id}`, { method: "DELETE" }),
  listAdminLearnVideos: () => request<LearnVideo[]>("/admin/learn/videos"),
  createAdminLearnVideo: (payload: LearnVideoInput) =>
    request<LearnVideo>("/admin/learn/videos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminLearnVideo: (id: number, payload: Partial<LearnVideoInput>) =>
    request<LearnVideo>(`/admin/learn/videos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteAdminLearnVideo: (id: number) =>
    request<void>(`/admin/learn/videos/${id}`, { method: "DELETE" }),
};
