import { TOPICS, PROBLEMS, PLAN, problemById, topicById } from '../data/index.js';
import { store } from '../store.js';
import { topicMastery, BASE_POINTS, grade } from '../scoring.js';
import { md } from '../markdown.js';
import { bar, diffClass, diffLabel, esc, inlineMd, $, $$ } from '../ui.js';
import { nextDueLabel } from '../srs.js';
import { pick } from '../lang.js';
import { matches } from '../search.js';

const curLang = () => store.get().lang || 'javascript';

/** Domain mặc định = lộ trình JavaScript/NeetCode. Lộ trình Python truyền domain riêng
 *  (xem data/python/index.js) để tái dùng toàn bộ UI thư viện chủ đề/bài tập bên dưới. */
const JS_DOMAIN = {
  TOPICS, PROBLEMS, topicById,
  basePath: '',
  topicsTitle: '📚 Thư viện chủ đề',
  topicsSubtitle: '18 chủ đề theo đúng lộ trình neetcode.io/roadmap. Mỗi bài giảng trả lời: vấn đề gốc là gì, ý tưởng cốt lõi, dấu hiệu nhận biết, mẫu code, bẫy thường gặp và ứng dụng thực tế.',
  problemsTitle: '⌨️ Ngân hàng bài tập',
};

/* ------------------------------- LỘ TRÌNH ------------------------------- */
export function renderPlan() {
  const st = store.get();
  const cur = store.currentDay();

  return `
    <h1>🗓️ Lộ trình 30 ngày</h1>
    <p class="sub">Mỗi ngày 90–120 phút. Thứ tự đã được sắp để kiến thức ngày sau dựa trên ngày trước — hãy bám sát thứ tự.</p>

    ${cur === null ? `
      <div class="card" style="border-color:var(--accent)">
        <div class="row">
          <div>
            <strong>Chưa bắt đầu lộ trình</strong>
            <div class="muted small">Bấm bắt đầu để hệ thống theo dõi tiến độ theo ngày.</div>
          </div>
          <span class="spacer"></span>
          <button class="btn" data-action="start-plan">Bắt đầu</button>
        </div>
      </div>` : `<p class="muted">Bạn đang ở <strong>ngày ${cur}</strong>. Bắt đầu từ ${new Date(st.startedAt).toLocaleDateString('vi-VN')}.</p>`}

    <div class="grid" style="margin-top:14px">
      ${PLAN.map((d) => dayCard(d, st, cur)).join('')}
    </div>
  `;
}

function dayCard(d, st, cur) {
  const done = d.problems.every((id) => st.problems[id]?.solved);
  const isToday = cur === d.day;
  return `
    <div class="day${done ? ' done' : ''}${isToday ? ' today' : ''}">
      <div class="num">${d.day}</div>
      <div style="flex:1">
        <div class="row" style="gap:6px">
          ${d.topics.map((id) => {
            const t = topicById.get(id);
            return `<a class="badge accent" style="text-decoration:none" href="#/topic/${id}">${t.icon} ${esc(t.name)}</a>`;
          }).join('')}
          ${d.quiz ? `<a class="badge" style="text-decoration:none" href="#/quiz/${d.quiz}">🧠 Quiz</a>` : ''}
          ${isToday ? '<span class="badge accent">Hôm nay</span>' : ''}
        </div>
        <p class="muted small" style="margin:8px 0">${inlineMd(d.focus)}</p>
        <div class="pill-row">
          ${d.problems.map((id) => {
            const p = problemById.get(id);
            const solved = st.problems[id]?.solved;
            return `<a class="badge ${solved ? 'ok' : diffClass(p.difficulty)}" style="text-decoration:none"
              href="#/problem/${id}">${solved ? '✓ ' : ''}${esc(p.title)}</a>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

/* ------------------------------ CHỦ ĐỀ ------------------------------ */
export function renderTopics(domain = JS_DOMAIN) {
  const { TOPICS, PROBLEMS, basePath, topicsTitle, topicsSubtitle } = domain;
  const st = store.get();
  const lang = curLang();
  return `
    <h1>${topicsTitle}</h1>
    <p class="sub">${topicsSubtitle}</p>
    <div class="grid c2">
      ${TOPICS.map((t) => {
        const m = topicMastery(t, PROBLEMS, st);
        const list = PROBLEMS.filter((p) => p.topic === t.id);
        const solved = list.filter((p) => st.problems[p.id]?.solved).length;
        const quizLen = pick(t, 'quiz', lang).length;
        return `<a class="card card-link" href="#${basePath}/topic/${t.id}">
          <div class="row"><strong>${t.icon} ${esc(t.name)}</strong><span class="spacer"></span><span class="badge${m >= 80 ? ' ok' : ''}">${m}%</span></div>
          <div class="muted small" style="margin:2px 0 8px">${esc(t.en)}${t.days ? ` · Ngày ${t.days.join(', ')}` : ''}</div>
          <p class="small" style="margin:0 0 10px">${esc(t.summary)}</p>
          ${bar(m, true)}
          <div class="muted small" style="margin-top:8px">${solved}/${list.length} bài · ${quizLen} câu quiz</div>
        </a>`;
      }).join('')}
    </div>`;
}

export function renderTopic(id, domain = JS_DOMAIN) {
  const { PROBLEMS, topicById, basePath } = domain;
  const t = topicById.get(id);
  if (!t) return '<h1>Không tìm thấy chủ đề</h1>';
  const st = store.get();
  const lang = curLang();
  const lesson = pick(t, 'lesson', lang);
  const syntax = pick(t, 'syntax', lang);
  const quizQs = pick(t, 'quiz', lang);
  const list = PROBLEMS.filter((p) => p.topic === t.id);
  const quiz = st.quizzes[t.id];

  store.markLessonRead(t.id);

  return `
    <div class="row">
      <a class="btn ghost small" href="#${basePath}/topics">← Thư viện</a>
      <span class="spacer"></span>
      ${t.days ? `<span class="badge">Ngày ${t.days.join(', ')}</span>` : ''}
    </div>

    <h1 style="margin-top:14px">${t.icon} ${esc(t.name)}</h1>
    <p class="sub">${esc(t.en)} — ${esc(t.summary)}</p>

    ${syntax ? `
      <details class="card syntax-primer" open>
        <summary>
          <strong>📖 Cú pháp cần biết trước</strong>
          <span class="muted small">Dành cho người chưa từng viết Python — đọc phần này trước bài giảng</span>
        </summary>
        <div class="md">${md(syntax)}</div>
      </details>` : ''}

    <div class="card md">${md(lesson)}</div>

    <h2>🧠 Kiểm tra hiểu bản chất</h2>
    <div class="card">
      <p style="margin-top:0">${quizQs.length} câu hỏi khái niệm. Đây là phần quan trọng nhất — giải được bài mà không hiểu bản chất thì tuần sau bạn sẽ quên sạch.</p>
      <div class="row">
        <a class="btn" href="#${basePath}/quiz/${t.id}">${quiz ? 'Làm lại quiz' : 'Làm quiz'}</a>
        ${quiz ? `<span class="badge${quiz.best >= 75 ? ' ok' : ''}">Điểm cao nhất: ${quiz.best}%</span>` : ''}
      </div>
    </div>

    <h2>⌨️ Bài tập của chủ đề</h2>
    <div class="list">
      ${list.map((p) => problemRow(p, st, basePath)).join('')}
    </div>
  `;
}

/* ------------------------------ BÀI TẬP ------------------------------ */
/** Trạng thái bộ lọc — giữ trong biến module để quay lại trang vẫn còn, nhưng
 *  KHÔNG lưu vào localStorage (lọc là việc tạm thời, không phải thiết lập). */
const filter = { q: '', diff: 'all', status: 'all', topic: 'all' };

const STATUS_OPTIONS = [
  ['all', 'Tất cả'],
  ['todo', 'Chưa giải'],
  ['done', 'Đã giải'],
  ['due', 'Đến hạn ôn'],
  ['marked', '⭐ Đã đánh dấu'],
];
/** Chỉ hiện chip cho những độ khó THỰC SỰ có bài — chip không bao giờ khớp là ngõ cụt. */
function diffOptions(problems) {
  const present = new Set(problems.map((p) => p.difficulty));
  return [['all', 'Mọi độ khó'], ...['Easy', 'Medium', 'Hard']
    .filter((d) => present.has(d))
    .map((d) => [d, diffLabel(d)])];
}

export function renderProblems(domain = JS_DOMAIN) {
  const { TOPICS, PROBLEMS, basePath, problemsTitle } = domain;
  const st = store.get();
  return `
    <h1>${problemsTitle}</h1>
    <p class="sub">${PROBLEMS.length} bài, sắp theo thứ tự học. Mỗi bài có 3 bậc gợi ý, chẩn đoán tự động khi sai, phân tích lời giải và câu hỏi độ phức tạp.</p>

    <div class="card filter-bar">
      <div class="row">
        <input id="f-q" class="search-input" type="search" placeholder="🔍 Tìm bài tập… (gõ không dấu cũng được: &quot;hai con tro&quot;)"
               value="${esc(filter.q)}" autocomplete="off" />
        <span class="muted small" id="f-count"></span>
      </div>
      <div class="row filter-row">
        ${chipGroup('diff', diffOptions(PROBLEMS), filter.diff)}
        <span class="filter-sep"></span>
        ${chipGroup('status', STATUS_OPTIONS, filter.status)}
        <span class="spacer"></span>
        <select id="f-topic" class="search-input select">
          <option value="all">Mọi chủ đề</option>
          ${TOPICS.map((t) => `<option value="${t.id}"${filter.topic === t.id ? ' selected' : ''}>${t.icon} ${esc(t.name)}</option>`).join('')}
        </select>
        <button class="btn ghost small" id="f-clear">Xoá bộ lọc</button>
      </div>
    </div>

    <div id="problem-groups">
      ${TOPICS.map((t) => {
        const list = PROBLEMS.filter((p) => p.topic === t.id);
        return `<div class="prob-group" data-topic="${t.id}">
          <h2>${t.icon} ${esc(t.name)}</h2>
          <div class="list">${list.map((p) => problemRow(p, st, basePath)).join('')}</div>
        </div>`;
      }).join('')}
    </div>
    <p class="muted center" id="f-empty" style="display:none;padding:26px 0">Không có bài nào khớp bộ lọc. Thử xoá bộ lọc hoặc gõ ít chữ hơn.</p>
  `;
}

function chipGroup(name, options, current) {
  return `<div class="chips" data-filter="${name}">
    ${options.map(([v, label]) => `<button type="button" class="chip fchip${current === v ? ' on' : ''}" data-v="${v}">${esc(label)}</button>`).join('')}
  </div>`;
}

/** Lọc tại chỗ: chỉ bật/tắt hiển thị, không render lại danh sách (nhanh và giữ được vị trí cuộn). */
export function mountProblems(domain = JS_DOMAIN) {
  const st = store.get();
  const byId = new Map(domain.PROBLEMS.map((p) => [p.id, p]));

  function apply() {
    let shown = 0;
    $$('#problem-groups .prob-group').forEach((group) => {
      let inGroup = 0;
      $$('.list-item', group).forEach((row) => {
        const p = byId.get(row.dataset.id);
        const ok = p ? keep(p, st) : false;
        row.style.display = ok ? '' : 'none';
        if (ok) inGroup++;
      });
      group.style.display = inGroup ? '' : 'none';
      shown += inGroup;
    });
    $('#f-count').textContent = shown === domain.PROBLEMS.length
      ? `${shown} bài`
      : `${shown}/${domain.PROBLEMS.length} bài khớp`;
    $('#f-empty').style.display = shown ? 'none' : '';
  }

  function keep(p, state) {
    if (filter.diff !== 'all' && p.difficulty !== filter.diff) return false;
    if (filter.topic !== 'all' && p.topic !== filter.topic) return false;

    const rec = state.problems[p.id];
    if (filter.status === 'todo' && rec?.solved) return false;
    if (filter.status === 'done' && !rec?.solved) return false;
    if (filter.status === 'due' && !(rec?.solved && rec.srs?.due && rec.srs.due <= Date.now())) return false;
    if (filter.status === 'marked' && !store.isBookmarked(p.id)) return false;

    if (filter.q && !matches([p.title, p.en, p.id, p.topicName], filter.q)) return false;
    return true;
  }

  $('#f-q').addEventListener('input', (e) => { filter.q = e.target.value; apply(); });
  $('#f-topic').addEventListener('change', (e) => { filter.topic = e.target.value; apply(); });

  $$('[data-filter]').forEach((group) => {
    const name = group.dataset.filter;
    group.addEventListener('click', (e) => {
      const chip = e.target.closest('.fchip');
      if (!chip) return;
      filter[name] = chip.dataset.v;
      $$('.fchip', group).forEach((c) => c.classList.toggle('on', c === chip));
      apply();
    });
  });

  $('#f-clear').addEventListener('click', () => {
    filter.q = ''; filter.diff = 'all'; filter.status = 'all'; filter.topic = 'all';
    $('#f-q').value = '';
    $('#f-topic').value = 'all';
    $$('[data-filter]').forEach((g) => $$('.fchip', g).forEach((c) => c.classList.toggle('on', c.dataset.v === 'all')));
    apply();
  });

  apply();
}

export function problemRow(p, st, basePath = '') {
  const rec = st.problems[p.id];
  const g = rec && rec.best ? grade(rec.best, p.difficulty) : null;
  return `<a class="list-item" data-id="${p.id}" href="#${basePath}/problem/${p.id}">
    <span>${rec?.solved ? '✅' : '⬜'}</span>
    <span class="t">${esc(p.title)}</span>
    <span class="badge ${diffClass(p.difficulty)}">${diffLabel(p.difficulty)}</span>
    ${store.isBookmarked(p.id) ? '<span title="Đã đánh dấu">⭐</span>' : ''}
    <span class="spacer"></span>
    ${g ? `<span class="badge ${g.color}">${g.letter}</span><span class="m">${rec.best}/${BASE_POINTS[p.difficulty]}</span>` : `<span class="m">~${p.targetMinutes}′</span>`}
    ${rec?.srs?.due ? `<span class="m">${nextDueLabel(rec.srs)}</span>` : ''}
  </a>`;
}
