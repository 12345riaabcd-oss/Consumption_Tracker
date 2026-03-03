export interface CheckInEntry {
  date: string; // YYYY-MM-DD
  smoked: boolean;
  count?: string;
  urgeTime?: string;
  feeling?: string;
  reflection?: string;
}

const STORAGE_KEY = "smoke-check-history";

export function getHistory(): CheckInEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCheckIn(entry: CheckInEntry): void {
  const history = getHistory();
  // Replace if same date exists
  const idx = history.findIndex((e) => e.date === entry.date);
  if (idx >= 0) history[idx] = entry;
  else history.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getWeekHistory(): (CheckInEntry | null)[] {
  const history = getHistory();
  const result: (CheckInEntry | null)[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push(history.find((e) => e.date === key) ?? null);
  }

  return result;
}

export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getWeekDates(): { key: string; label: string; dayName: string }[] {
  const today = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push({
      key: d.toISOString().split("T")[0],
      label: d.getDate().toString(),
      dayName: days[d.getDay()],
    });
  }

  return result;
}
