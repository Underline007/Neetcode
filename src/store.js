/**
 * Lưu trữ tiến độ học tập trong localStorage.
 * Toàn bộ dữ liệu nằm dưới 1 key duy nhất -> dễ export/import.
 *
 * Cấu hình đồng bộ đa máy (địa chỉ Worker + mã đồng bộ) nằm ở một key RIÊNG:
 * nó mang tính bí mật và gắn với từng máy, nên không được lẫn vào tiến độ khi
 * xuất file hay đẩy lên máy chủ.
 */
import { mergeState, summarizeMerge } from './sync-merge.js';

const KEY = 'neetcode30:v1';
const SYNC_KEY = 'neetcode30:sync:v1';

const EMPTY = () => ({
  version: 1,
  createdAt: Date.now(),
  updatedAt: Date.now(),    // lần sửa gần nhất — dùng khi gộp dữ liệu giữa các máy
  startedAt: null,          // ngày bắt đầu lộ trình 30 ngày
  xp: 0,
  streak: { count: 0, lastDay: null },
  problems: {},             // id -> { best, attempts, solved, hintsUsed, revealed, firstTry, code, lastRun, srs }
  quizzes: {},              // topicId -> { best, attempts, lastAt }
  lessons: {},              // topicId -> { readAt }
  days: {},                 // dayNumber -> { doneAt }
  log: [],                  // { at, type, ref, points }
  notes: {},                // problemId -> { text, updatedAt }
  bookmarks: {},            // problemId -> true
  cards: {},                // cardId -> { due, interval, ease, reps }  (thẻ luyện nhớ, dùng chung srs.js)
  errorStats: {},           // errorKey -> { count, lastAt, lastProblem }
  theme: 'dark',
  lang: 'javascript',       // ngôn ngữ đang chọn để duyệt/học: 'javascript' | 'python'
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
  state.updatedAt = Date.now();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  }, 120);
}

/** Báo cho thanh bên (và bộ đồng bộ tự động) rằng tiến độ vừa đổi. */
function notifyChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('progress-changed'));
}

function loadSyncConfig() {
  try {
    return { url: '', code: '', auto: true, lastAt: null, version: 0, ...JSON.parse(localStorage.getItem(SYNC_KEY) || '{}') };
  } catch {
    return { url: '', code: '', auto: true, lastAt: null, version: 0 };
  }
}

let syncConfig = loadSyncConfig();

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

  /* ------------------------- ghi chú & đánh dấu ------------------------- */
  noteText(problemId) { return state.notes[problemId]?.text || ''; },

  setNote(problemId, text) {
    const t = String(text ?? '');
    if (!t.trim()) delete state.notes[problemId];
    else state.notes[problemId] = { text: t, updatedAt: Date.now() };
    persist();
  },

  isBookmarked(problemId) { return !!state.bookmarks[problemId]; },

  /** Bật/tắt đánh dấu, trả về trạng thái MỚI */
  toggleBookmark(problemId) {
    if (state.bookmarks[problemId]) delete state.bookmarks[problemId];
    else state.bookmarks[problemId] = true;
    persist();
    return !!state.bookmarks[problemId];
  },

  /* --------------------------- thẻ luyện nhớ --------------------------- */
  card(cardId) {
    if (!state.cards[cardId]) state.cards[cardId] = { due: null, interval: 0, ease: 2.5, reps: 0 };
    return state.cards[cardId];
  },

  /* ------------------------- thống kê lỗi hay mắc ------------------------- */
  /** Ghi nhận một loại lỗi vừa mắc phải — dùng để dựng mục "Lỗi bạn hay mắc" ở Sổ tay. */
  logError(key, problemId) {
    if (!key) return;
    const e = state.errorStats[key] || { count: 0, lastAt: null, lastProblem: null };
    e.count++;
    e.lastAt = Date.now();
    e.lastProblem = problemId || e.lastProblem;
    state.errorStats[key] = e;
    persist();
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
    notifyChanged();
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

  /** Bản sao state để đẩy lên máy chủ đồng bộ (không kèm cấu hình sync). */
  snapshot() { return JSON.parse(JSON.stringify(state)); },

  /**
   * Nhập tiến độ từ nơi khác.
   * Mặc định là GỘP: giữ lại mọi thứ tốt nhất của cả hai bên. Chỉ dùng
   * mode 'replace' khi người dùng cố ý muốn ghi đè (ví dụ khôi phục bản sao lưu).
   */
  import(json, { mode = 'merge' } = {}) {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    if (!parsed || typeof parsed !== 'object') throw new Error('Dữ liệu không hợp lệ');
    if (mode === 'replace') {
      state = { ...EMPTY(), ...parsed };
      persist();
      notifyChanged();
      return { newProblems: 0, newSolved: 0, xpGained: 0 };
    }
    return this.mergeRemote(parsed);
  },

  /** Gộp một bản state đến từ máy khác vào state hiện tại. */
  mergeRemote(remote) {
    const before = this.snapshot();
    state = mergeState({ ...EMPTY(), ...state }, { ...EMPTY(), ...remote });
    persist();
    notifyChanged();
    return summarizeMerge(before, state);
  },

  /* ----------------------- cấu hình đồng bộ đa máy ----------------------- */

  sync: {
    get: () => ({ ...syncConfig }),
    set(patch) {
      syncConfig = { ...syncConfig, ...patch };
      try { localStorage.setItem(SYNC_KEY, JSON.stringify(syncConfig)); } catch { /* quota */ }
      return { ...syncConfig };
    },
    clear() {
      syncConfig = { url: '', code: '', auto: true, lastAt: null, version: 0 };
      try { localStorage.removeItem(SYNC_KEY); } catch { /* ignore */ }
    },
  },

  setTheme(t) { state.theme = t; persist(); },
  setLang(l) { state.lang = l; persist(); },
};
