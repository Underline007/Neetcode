/**
 * Lưu trữ tiến độ học tập trong localStorage.
 * Toàn bộ dữ liệu nằm dưới 1 key duy nhất -> dễ export/import.
 */
const KEY = 'neetcode30:v1';

const EMPTY = () => ({
  version: 1,
  createdAt: Date.now(),
  startedAt: null,          // ngày bắt đầu lộ trình 30 ngày
  xp: 0,
  streak: { count: 0, lastDay: null },
  problems: {},             // id -> { best, attempts, solved, hintsUsed, revealed, firstTry, code, lastRun, srs }
  quizzes: {},              // topicId -> { best, attempts, lastAt }
  lessons: {},              // topicId -> { readAt }
  days: {},                 // dayNumber -> { doneAt }
  log: [],                  // { at, type, ref, points }
  theme: 'dark',
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY();
    const parsed = JSON.parse(raw);
    return { ...EMPTY(), ...parsed };
  } catch {
    return EMPTY();
  }
}

let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  }, 120);
}

export const store = {
  get: () => state,

  /** ngày dạng YYYY-MM-DD theo giờ máy người học */
  today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  problem(id) {
    if (!state.problems[id]) {
      state.problems[id] = {
        best: 0, attempts: 0, solved: false, hintsUsed: 0, revealed: false,
        firstTry: null, code: null, lastRun: null,
        srs: { due: null, interval: 0, ease: 2.5, reps: 0 },
      };
    }
    return state.problems[id];
  },

  quiz(topicId) {
    if (!state.quizzes[topicId]) state.quizzes[topicId] = { best: 0, attempts: 0, lastAt: null };
    return state.quizzes[topicId];
  },

  addXp(points, entry) {
    state.xp = Math.max(0, Math.round(state.xp + points));
    if (entry) {
      state.log.unshift({ at: Date.now(), points: Math.round(points), ...entry });
      state.log = state.log.slice(0, 400);
    }
    this.touchStreak();
    persist();
    // báo cho thanh bên cập nhật ngay, không đợi chuyển trang
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('progress-changed'));
    return state.xp;
  },

  /** Cập nhật chuỗi ngày học liên tục */
  touchStreak() {
    const t = this.today();
    const s = state.streak;
    if (s.lastDay === t) return;
    const yesterday = new Date(Date.now() - 86400000);
    const y = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    s.count = s.lastDay === y ? s.count + 1 : 1;
    s.lastDay = t;
    if (!state.startedAt) state.startedAt = Date.now();
    persist();
  },

  markLessonRead(topicId) {
    if (!state.lessons[topicId]) {
      state.lessons[topicId] = { readAt: Date.now() };
      this.addXp(10, { type: 'lesson', ref: topicId });
    }
    persist();
  },

  markDayDone(day) {
    state.days[day] = { doneAt: Date.now() };
    persist();
  },

  startPlan() {
    state.startedAt = Date.now();
    persist();
  },

  /** Ngày thứ mấy của lộ trình (1-based), null nếu chưa bắt đầu */
  currentDay() {
    if (!state.startedAt) return null;
    const days = Math.floor((Date.now() - state.startedAt) / 86400000) + 1;
    return Math.min(30, Math.max(1, days));
  },

  save: persist,

  reset() {
    state = EMPTY();
    localStorage.removeItem(KEY);
    persist();
  },

  export() { return JSON.stringify(state, null, 2); },

  import(json) {
    const parsed = JSON.parse(json);
    state = { ...EMPTY(), ...parsed };
    persist();
  },

  setTheme(t) { state.theme = t; persist(); },
};
