import { api, getToken, type UserPlayState, type UserPlayStateUpdate } from "@/lib/api";

export const LOCAL_PROGRESS_KEY = "love21_trail_progress_v2";
export const LOCAL_STREAK_KEY = "love21_21_moves_streak_v1";

export type LocalProgress = {
  dayNumber: number;
  eventIndex: number;
  correctCount: number;
  totalAnswered: number;
};

export type LocalStreak = {
  totalPlays: number;
  currentStreak: number;
  bestStreak: number;
};

export const DEFAULT_LOCAL_PROGRESS: LocalProgress = {
  dayNumber: 1,
  eventIndex: 0,
  correctCount: 0,
  totalAnswered: 0,
};

export const DEFAULT_LOCAL_STREAK: LocalStreak = {
  totalPlays: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export function loadLocalProgress(): LocalProgress {
  if (typeof window === "undefined") return DEFAULT_LOCAL_PROGRESS;
  try {
    const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
    if (!raw) return DEFAULT_LOCAL_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    return { ...DEFAULT_LOCAL_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_LOCAL_PROGRESS;
  }
}

export function loadLocalStreak(): LocalStreak {
  if (typeof window === "undefined") return DEFAULT_LOCAL_STREAK;
  try {
    const raw = window.localStorage.getItem(LOCAL_STREAK_KEY);
    if (!raw) return DEFAULT_LOCAL_STREAK;
    const parsed = JSON.parse(raw) as Partial<LocalStreak>;
    const currentStreak = Math.max(0, Math.floor(parsed.currentStreak ?? 0));
    const bestStreak = Math.max(Math.floor(parsed.bestStreak ?? 0), currentStreak);
    return {
      totalPlays: Math.max(0, Math.floor(parsed.totalPlays ?? 0)),
      currentStreak,
      bestStreak,
    };
  } catch {
    return DEFAULT_LOCAL_STREAK;
  }
}

export function saveLocalProgress(progress: LocalProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage failures
  }
}

export function saveLocalStreak(streak: LocalStreak) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(streak));
  } catch {
    // ignore storage failures
  }
}

export function playStateToLocal(state: UserPlayState): { progress: LocalProgress; streak: LocalStreak } {
  return {
    progress: {
      dayNumber: state.day_number,
      eventIndex: state.event_index,
      correctCount: state.correct_count,
      totalAnswered: state.total_answered,
    },
    streak: {
      totalPlays: state.total_plays,
      currentStreak: state.current_streak,
      bestStreak: state.best_streak,
    },
  };
}

export function localToPlayStateUpdate(progress: LocalProgress, streak: LocalStreak): UserPlayStateUpdate {
  return {
    day_number: progress.dayNumber,
    event_index: progress.eventIndex,
    correct_count: progress.correctCount,
    total_answered: progress.totalAnswered,
    current_streak: streak.currentStreak,
    best_streak: streak.bestStreak,
    total_plays: streak.totalPlays,
  };
}

function isFreshServerState(state: UserPlayState) {
  return (
    state.day_number === 1 &&
    state.event_index === 0 &&
    state.total_plays === 0 &&
    state.current_streak === 0 &&
    state.total_answered === 0
  );
}

function hasLocalProgress() {
  const progress = loadLocalProgress();
  const streak = loadLocalStreak();
  return (
    progress.dayNumber > 1 ||
    progress.eventIndex > 0 ||
    progress.totalAnswered > 0 ||
    streak.totalPlays > 0 ||
    streak.currentStreak > 0
  );
}

export async function loadPlayStateForUser(): Promise<{ progress: LocalProgress; streak: LocalStreak; fromServer: boolean }> {
  if (!getToken()) {
    return { progress: loadLocalProgress(), streak: loadLocalStreak(), fromServer: false };
  }

  try {
    let serverState = await api.getSupporterPlayState();
    if (isFreshServerState(serverState) && hasLocalProgress()) {
      const localProgress = loadLocalProgress();
      const localStreak = loadLocalStreak();
      serverState = await api.saveSupporterPlayState(localToPlayStateUpdate(localProgress, localStreak));
    }
    const mapped = playStateToLocal(serverState);
    saveLocalProgress(mapped.progress);
    saveLocalStreak(mapped.streak);
    return { ...mapped, fromServer: true };
  } catch {
    return { progress: loadLocalProgress(), streak: loadLocalStreak(), fromServer: false };
  }
}

export async function persistPlayState(progress: LocalProgress, streak: LocalStreak) {
  saveLocalProgress(progress);
  saveLocalStreak(streak);
  if (!getToken()) return;
  try {
    await api.saveSupporterPlayState(localToPlayStateUpdate(progress, streak));
  } catch {
    // local copy remains the fallback
  }
}
