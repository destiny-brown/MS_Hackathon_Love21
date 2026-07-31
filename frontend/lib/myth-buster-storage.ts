import { getDateKey } from "@/lib/myth-buster-data";

const STORAGE_KEY = "love21_daily_myth_buster";

export type DailyGameState = {
  dateKey: string;
  attempts: number;
  guesses: ("myth" | "fact")[];
  completed: boolean;
  won: boolean;
};

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  today: DailyGameState | null;
};

type StoredData = {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  games: Record<string, DailyGameState>;
};

function readStorage(): StoredData {
  if (typeof window === "undefined") {
    return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null, games: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null, games: {} };
    }
    return JSON.parse(raw) as StoredData;
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null, games: {} };
  }
}

function writeStorage(data: StoredData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function isYesterday(dateKey: string, previousDateKey: string | null): boolean {
  if (!previousDateKey) return false;
  const current = new Date(`${dateKey}T12:00:00`);
  const previous = new Date(`${previousDateKey}T12:00:00`);
  const diffDays = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

function updateStreak(data: StoredData, dateKey: string): void {
  const game = data.games[dateKey];
  if (!game?.completed) return;

  if (data.lastCompletedDate === dateKey) return;

  if (data.lastCompletedDate === null || isYesterday(dateKey, data.lastCompletedDate)) {
    data.currentStreak += 1;
  } else if (data.lastCompletedDate !== dateKey) {
    data.currentStreak = 1;
  }

  data.lastCompletedDate = dateKey;
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
}

export function getStreakData(date: Date = new Date()): StreakData {
  const dateKey = getDateKey(date);
  const data = readStorage();
  const today = data.games[dateKey] ?? null;
  return {
    currentStreak: data.currentStreak,
    longestStreak: data.longestStreak,
    lastCompletedDate: data.lastCompletedDate,
    today,
  };
}

export function getOrCreateTodayGame(date: Date = new Date()): DailyGameState {
  const dateKey = getDateKey(date);
  const data = readStorage();

  if (!data.games[dateKey]) {
    data.games[dateKey] = {
      dateKey,
      attempts: 0,
      guesses: [],
      completed: false,
      won: false,
    };
    writeStorage(data);
  }

  return data.games[dateKey];
}

export function submitGuess(
  guess: "myth" | "fact",
  correctAnswer: "myth" | "fact",
  date: Date = new Date(),
): DailyGameState {
  const dateKey = getDateKey(date);
  const data = readStorage();
  const game = data.games[dateKey] ?? {
    dateKey,
    attempts: 0,
    guesses: [],
    completed: false,
    won: false,
  };

  if (game.completed) return game;

  game.attempts += 1;
  game.guesses.push(guess);

  const won = guess === correctAnswer;
  if (won || game.attempts >= 3) {
    game.completed = true;
    game.won = won;
    updateStreak(data, dateKey);
  }

  data.games[dateKey] = game;
  writeStorage(data);
  return game;
}
