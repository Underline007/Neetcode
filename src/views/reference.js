/**
 * 🔎 Tra cứu nhanh + 🧠 Luyện nhớ.
 *
 * Hai trang cùng phục vụ một việc: giúp người học **nhớ được cú pháp và cấu trúc dữ liệu**,
 * thay vì mỗi lần cần lại phải đi tìm.
 *   - Tra cứu nhanh: tra khi đang cần (tìm không dấu, có nút chép, đối chiếu JS ↔ Python).
 *   - Luyện nhớ: ôn chủ động bằng thẻ, xếp lịch bằng đúng SM-2 của bài tập.
 *
 * Bảng cú pháp dựng TRỰC TIẾP từ `syntax-hints.js` — không chép lại dữ liệu ở đây.
 */

import { HINTS, KIND_LABEL, HINT_TOPICS, EX_EXACT, EX_ABOUT, hintHaystack } from '../hints/index.js';
import { DS_REFERENCE, PICK_TABLE, XLANG } from '../data/reference.js';
import { problemById } from '../data/index.js';
import { store } from '../store.js';
import { md } from '../markdown.js';
import { $, $$, esc, toast, bar } from '../ui.js';
import { matches } from '../search.js';
import { DECKS, GRADES, cardsOfDeck, dueCards, deckProgress, gradeCard } from '../drill.js';
import { nextDueLabel } from '../srs.js';

const curLang = () => (store.get().lang === 'python' ? 'python' : 'javascript');

/* ==================================================================== */
/*                          🔎 TRA CỨU NHANH                            */
/* ==================================================================== */

/** Trạng thái của trang, giữ trong module để quay lại vẫn còn (không lưu localStorage). */
const cs = { q: '', lang: null, section: 'all', topic: 'all' };

const SECTIONS = [
  ['all', 'Tất cả'],
  ['pick', '🧭 Chọn cấu trúc'],
  ['ds', '🧱 Cấu trúc dữ liệu'],
  ['xlang', '🔀 JS ↔ Python'],
  ['syntax', '🧩 Cú pháp'],
];

export function renderCheatsheet() {
  if (cs.lang === null) cs.lang = curLang();
  return `
    <h1>🔎 Tra cứu nhanh</h1>
    <p class="sub">Không phải học thuộc — biết <strong>tra ở đâu trong 5 giây</strong> là đủ.
      Gõ không dấu cũng tìm được. Muốn nhớ luôn thì sang mục <a href="#/drill">🧠 Luyện nhớ</a>.</p>

    <div class="card filter-bar">
      <div class="row">
        <input id="cs-q" class="search-input" type="search" autocomplete="off"
               placeholder="🔍 Tìm: &quot;dem tan suat&quot;, &quot;heap&quot;, &quot;enumerate&quot;, &quot;bfs&quot;…" value="${esc(cs.q)}" />
        <span class="muted small" id="cs-count"></span>
      </div>
      <div class="row filter-row">
        <div class="chips" data-cs="section">
          ${SECTIONS.map(([v, l]) => `<button type="button" class="chip fchip${cs.section === v ? ' on' : ''}" data-v="${v}">${esc(l)}</button>`).join('')}
        </div>
        <span class="spacer"></span>
        <div class="chips" data-cs="lang">
          <button type="button" class="chip fchip${cs.lang === 'javascript' ? ' on' : ''}" data-v="javascript">🟨 JavaScript</button>
          <button type="button" class="chip fchip${cs.lang === 'python' ? ' on' : ''}" data-v="python">🐍 Python</button>
        </div>
      </div>
      ${cs.lang === 'python' ? `
        <div class="row filter-row">
          <span class="muted small">Cú pháp theo module:</span>
          <div class="chips" data-cs="topic">
            <button type="button" class="chip fchip${cs.topic === 'all' ? ' on' : ''}" data-v="all">Tất cả</button>
            ${HINT_TOPICS.map((t) => `<button type="button" class="chip fchip${cs.topic === t.id ? ' on' : ''}" data-v="${t.id}">${esc(t.label)}</button>`).join('')}
          </div>
        </div>` : ''}
    </div>

    <div id="cs-body">${cheatBody()}</div>`;
}

export function mountCheatsheet() {
  const redraw = () => {
    $('#cs-body').innerHTML = cheatBody();
    updateCount();
  };
  const updateCount = () => {
    const n = $$('#cs-body .cs-hit').length;
    $('#cs-count').textContent = cs.q ? `${n} mục khớp` : '';
  };

  $('#cs-q').addEventListener('input', (e) => { cs.q = e.target.value; redraw(); });
  $$('[data-cs]').forEach((group) => {
    const key = group.dataset.cs;
    group.addEventListener('click', (e) => {
      const chip = e.target.closest('.fchip');
      if (!chip) return;
      cs[key] = chip.dataset.v;
      $$('.fchip', group).forEach((c) => c.classList.toggle('on', c === chip));
      // Đổi ngôn ngữ thì hàng lọc theo module xuất hiện/biến mất -> phải dựng lại cả thanh lọc
      if (key === 'lang') { $('#view').innerHTML = renderCheatsheet(); mountCheatsheet(); return; }
      redraw();
    });
  });
  updateCount();
}

/** Panel trượt "tra cứu" dùng lại trong trang làm bài — chỉ phần bảng cú pháp.
 *  Bảng này chỉ có cú pháp của MỘT ngôn ngữ, nên khi không khớp phải chỉ đường đi tiếp
 *  (bảng cấu trúc dữ liệu ở trang Tra cứu nhanh có cả hai ngôn ngữ).
 *
 *  `moduleId` là module của bài đang làm: cú pháp của module đó được đưa lên đầu, để
 *  mở panel ra là thấy ngay phần vừa học chứ không phải cuộn đi tìm. */
export function syntaxSectionsHtml(lang, query = '', moduleId = null) {
  const topic = HINT_TOPICS.find((t) => t.module === moduleId)?.id || null;
  const html = syntaxSection(lang, query, { topic });
  if (html) return html;
  const name = lang === 'python' ? 'Python' : 'JavaScript';
  return `<div class="card tight">
    <strong>Không có mục nào khớp “${esc(query)}”</strong>
    <p class="small" style="margin:8px 0 0">Bảng này chỉ liệt kê cú pháp ${name}. Thứ bạn tìm có thể là
      một <em>cấu trúc dữ liệu</em> (hàng đợi, heap, trie…) — những thứ đó nằm ở
      <a href="#/cheatsheet">🔎 Tra cứu nhanh</a>, kèm chi phí thao tác và cú pháp của cả hai ngôn ngữ.</p>
  </div>`;
}

function cheatBody() {
  const q = cs.q;
  const show = (name) => cs.section === 'all' || cs.section === name;
  const parts = [
    show('pick') ? pickSection(q) : '',
    show('ds') ? dsSection(q) : '',
    show('xlang') ? xlangSection(q) : '',
    show('syntax') ? syntaxSection(cs.lang, q, { only: cs.topic }) : '',
  ].filter(Boolean);

  if (!parts.length) {
    return `<div class="card center" style="padding:28px">
      <p class="muted" style="margin:0">Không có mục nào khớp “${esc(q)}”. Thử gõ ít chữ hơn, hoặc bỏ bộ lọc mục.</p>
    </div>`;
  }
  return parts.join('');
}

/* --------------------------- dấu hiệu → cấu trúc --------------------------- */
function pickSection(q) {
  const rows = PICK_TABLE.filter((r) => !q || matches([r.need, r.structure, r.why], q));
  if (!rows.length) return '';
  return `
    <h2>🧭 Đề bài nói thế này → dùng cấu trúc nào</h2>
    <p class="muted small">Bảng quan trọng nhất của trang này. Giải được bài lạ hay không phụ thuộc vào việc
      bạn có nhận ra <em>dấu hiệu</em> hay không, chứ không phải nhớ được bao nhiêu lời giải.</p>
    <div class="card tight cs-table-wrap">
      <table class="cs-table">
        <thead><tr><th>Dấu hiệu trong đề</th><th>Dùng</th><th>Vì sao</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr class="cs-hit">
            <td>${esc(r.need)}</td>
            <td><strong>${esc(r.structure)}</strong></td>
            <td class="muted">${esc(r.why)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* --------------------------- cấu trúc dữ liệu --------------------------- */
function dsSection(q) {
  const hits = DS_REFERENCE.filter((d) => !q || matches(
    [d.name, d.en, d.id, d.when, ...d.ops.map((o) => `${o.op} ${o.js} ${o.py}`), ...d.pitfalls], q,
  ));
  if (!hits.length) return '';

  return `
    <h2>🧱 Cấu trúc dữ liệu — chi phí, cú pháp, bẫy</h2>
    <div class="grid">
      ${hits.map((d) => `
        <details class="card cs-ds cs-hit"${q ? ' open' : ''}>
          <summary>
            <strong>${d.icon} ${esc(d.name)}</strong>
            <span class="muted small">${esc(d.en)}</span>
          </summary>
          <p class="small" style="margin:10px 0"><strong>Dùng khi:</strong> ${esc(d.when)}</p>

          <div class="cs-table-wrap">
            <table class="cs-table ops">
              <thead><tr><th>Thao tác</th><th>Chi phí</th><th>JavaScript</th><th>Python</th></tr></thead>
              <tbody>
                ${d.ops.map((o) => `<tr>
                  <td>${esc(o.op)}</td>
                  <td><span class="big-o">${esc(o.big)}</span></td>
                  <td><code>${esc(o.js)}</code></td>
                  <td><code>${esc(o.py)}</code></td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>

          <h4>⚠️ Bẫy thường gặp</h4>
          <ul class="cs-pitfalls">
            ${d.pitfalls.map((p) => `<li>${md(p).replace(/^<p>|<\/p>$/g, '')}</li>`).join('')}
          </ul>

          ${d.problems?.length ? `<div class="row" style="margin-top:6px">
            <span class="muted small">Luyện ở:</span>
            ${d.problems.map((id) => {
              const p = problemById.get(id);
              return p ? `<a class="badge" style="text-decoration:none" href="#/problem/${id}">${esc(p.title)}</a>` : '';
            }).join('')}
          </div>` : ''}
        </details>`).join('')}
    </div>`;
}

/* --------------------------- đối chiếu JS ↔ Python --------------------------- */
function xlangSection(q) {
  const groups = XLANG
    .map((g) => ({ ...g, rows: g.rows.filter((r) => !q || matches([r.what, r.js, r.py, r.note], q)) }))
    .filter((g) => g.rows.length);
  if (!groups.length) return '';

  return `
    <h2>🔀 Đối chiếu JavaScript ↔ Python</h2>
    <p class="muted small">Biết một ngôn ngữ rồi học ngôn ngữ kia thì đây là bảng tiết kiệm thời gian nhất.</p>
    ${groups.map((g) => `
      <h3>${esc(g.group)}</h3>
      <div class="card tight cs-table-wrap">
        <table class="cs-table xlang">
          <thead><tr><th>Việc cần làm</th><th>🟨 JavaScript</th><th>🐍 Python</th><th>Lưu ý</th></tr></thead>
          <tbody>
            ${g.rows.map((r) => `<tr class="cs-hit">
              <td>${esc(r.what)}</td>
              <td><code>${esc(r.js)}</code></td>
              <td><code>${esc(r.py)}</code></td>
              <td class="muted small">${esc(r.note || '')}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`).join('')}`;
}

/* --------------------------- bảng cú pháp --------------------------- */
/** Tìm trong tên, từ khoá phụ, chữ ký, mô tả VÀ cả ví dụ — gõ "0.30000000000000004"
 *  cũng phải tìm ra chỗ giải thích số thực. */
const synHay = (i) => [...hintHaystack(i), (i.ex || []).join(' ')];

/** Một mục cú pháp: viết thế nào → làm gì → chạy ra cái gì. */
function synItem(i) {
  const copy = i.insert ? i.insert.split('$|').join('') : i.label;
  return `
    <div class="card tight syn-item cs-hit">
      <div class="row">
        <code class="syn-name">${esc(i.label)}</code>
        <span class="badge">${esc(KIND_LABEL[i.kind] || i.kind)}</span>
        <span class="spacer"></span>
        <button type="button" class="code-copy" data-copy="${esc(copy)}" title="Chép vào bộ nhớ tạm">📋</button>
      </div>
      <code class="syn-sig">${esc(i.detail || i.label)}</code>
      <p class="syn-doc">${esc(i.doc || '')}</p>
      ${(i.ex || []).length ? `<ul class="syn-ex">
        ${i.ex.map((ex) => {
          const arrow = ex.includes(` ${EX_ABOUT} `) ? EX_ABOUT : EX_EXACT;
          const at = ex.lastIndexOf(` ${arrow} `);
          const code = at < 0 ? ex : ex.slice(0, at);
          const out = at < 0 ? '' : ex.slice(at + arrow.length + 2);
          // Ví dụ nhiều dòng thì xuống hàng cho phần kết quả, nếu không mũi tên bị
          // đẩy lên cạnh dòng đầu và trông như kết quả của riêng dòng đó.
          const multi = code.includes('\n');
          return `<li${multi ? ' class="multi"' : ''}><code class="ex-code">${esc(code)}</code>${out
            ? `<span class="ex-pair"><span class="ex-arrow" title="${arrow === EX_ABOUT ? 'kết quả tuỳ lúc chạy' : 'kết quả chính xác'}">${arrow}</span><code class="ex-out">${esc(out)}</code></span>`
            : ''}</li>`;
        }).join('')}
      </ul>` : ''}
    </div>`;
}

/**
 * Bảng cú pháp, chia theo CHỦ ĐỀ (trùng với 15 module của lộ trình Python) chứ không
 * theo phân loại kỹ thuật: đang học module nào thì tra đúng phần của module đó.
 *
 * @param {object} [opts] { topic } — chủ đề cần đặt lên đầu (module của bài đang làm)
 */
function syntaxSection(lang, q, { topic = null, only = null } = {}) {
  const dict = HINTS[lang] || HINTS.python;
  const label = lang === 'python' ? '🐍 Python' : '🟨 JavaScript';
  const items = [...dict.globals, ...dict.members].filter((i) => (!q || matches(synHay(i), q)));
  if (!items.length) return '';

  // JavaScript chưa gắn chủ đề -> một khối duy nhất.
  const groups = lang === 'python'
    ? orderedTopics(topic)
      .map((t) => ({ ...t, items: items.filter((i) => i.topic === t.id) }))
      .filter((g) => g.items.length && (!only || only === 'all' || only === g.id))
    : [{ id: 'js', label: 'Cú pháp JavaScript', items }];
  if (!groups.length) return '';

  return `<h2>🧩 Cú pháp ${label}</h2>
    <p class="muted small">Mỗi mục có <strong>ví dụ kèm kết quả</strong> — mọi ví dụ đều đã được chạy thật bằng Python
      (xem tools/test-hints.mjs), nên kết quả ghi ở đây là kết quả thật. Bấm 📋 để chép.</p>
    ${groups.map((g) => `
      <h3>${esc(g.label)} <span class="badge">${g.items.length}</span></h3>
      <div class="grid c2 syn-grid">${g.items.map(synItem).join('')}</div>`).join('')}`;
}

/** Thứ tự chủ đề, có thể đưa một chủ đề lên đầu (chủ đề của bài đang làm). */
function orderedTopics(first) {
  if (!first) return HINT_TOPICS;
  const head = HINT_TOPICS.filter((t) => t.id === first);
  return [...head, ...HINT_TOPICS.filter((t) => t.id !== first)];
}

/* ==================================================================== */
/*                            🧠 LUYỆN NHỚ                              */
/* ==================================================================== */

const drill = { deck: 'all', queue: [], at: 0, flipped: false, done: 0, startedAt: 0 };

export function renderDrill() {
  const st = store.get();
  const decks = [{ id: 'all', label: '🎴 Tất cả' }, ...DECKS];

  return `
    <h1>🧠 Luyện nhớ</h1>
    <p class="sub">Tra cứu giúp bạn <em>làm xong bài hôm nay</em>; ôn thẻ giúp bạn <em>không phải tra lần sau</em>.
      Thẻ dùng chung thuật toán ôn ngắt quãng với bài tập: nhớ tốt thì giãn ra, quên thì quay lại sớm.</p>

    <div class="grid c4">
      ${decks.map((d) => {
        const p = deckProgress(d.id, st);
        return `<div class="card stat deck-card${drill.deck === d.id ? ' on' : ''}" data-deck="${d.id}">
          <div class="n"><span class="deck-due">${p.due}</span><span class="muted small">/${p.total}</span></div>
          <div class="l">${esc(d.label)}</div>
          <div style="margin-top:8px">${bar((p.learned / Math.max(1, p.total)) * 100, true)}</div>
          <div class="muted small deck-learned" style="margin-top:6px">đã học ${p.learned} thẻ</div>
        </div>`;
      }).join('')}
    </div>

    <div id="drill-box" style="margin-top:18px"></div>`;
}

export function mountDrill() {
  $$('.deck-card').forEach((el) => {
    el.addEventListener('click', () => {
      drill.deck = el.dataset.deck;
      $$('.deck-card').forEach((c) => c.classList.toggle('on', c === el));
      startSession();
    });
  });
  startSession();
}

function startSession() {
  const due = dueCards(drill.deck);
  drill.queue = shuffle(due).slice(0, 20);   // một phiên vừa sức, không dồn cả trăm thẻ
  drill.at = 0;
  drill.flipped = false;
  drill.done = 0;
  drill.startedAt = Date.now();
  drawCard();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawCard() {
  const box = $('#drill-box');
  if (!box) return;

  if (!drill.queue.length) {
    const total = cardsOfDeck(drill.deck).length;
    box.innerHTML = `<div class="card center" style="padding:34px">
      <h3 style="margin-top:0">✨ Không còn thẻ nào đến hạn</h3>
      <p class="muted" style="margin:0">Bộ này có ${total} thẻ, tất cả đều đã được xếp lịch cho lần ôn sau.
        Quay lại vào ngày mai — ôn đúng lúc sắp quên mới là chỗ thuật toán phát huy tác dụng.</p>
    </div>`;
    return;
  }

  if (drill.at >= drill.queue.length) {
    const mins = Math.max(1, Math.round((Date.now() - drill.startedAt) / 60000));
    if (drill.done > 0) store.addXp(Math.min(20, drill.done), { type: 'drill', ref: drill.deck });
    box.innerHTML = `<div class="card center" style="padding:34px;border-color:var(--ok)">
      <h3 style="margin-top:0">✅ Xong phiên — ${drill.done} thẻ trong ~${mins} phút</h3>
      <p class="muted">Mỗi thẻ đã được xếp lịch gặp lại theo mức bạn tự chấm.</p>
      <button class="btn" id="drill-again">Luyện tiếp</button>
    </div>`;
    $('#drill-again').addEventListener('click', startSession);
    return;
  }

  const card = drill.queue[drill.at];
  const rec = store.get().cards?.[card.id];
  const seen = rec?.reps > 0;

  box.innerHTML = `
    <div class="card flashcard">
      <div class="row">
        <span class="badge">${esc(card.tag || '')}</span>
        ${seen ? `<span class="badge">đã gặp ${rec.reps} lần</span>` : '<span class="badge accent">thẻ mới</span>'}
        <span class="spacer"></span>
        <span class="muted small">${drill.at + 1}/${drill.queue.length}</span>
      </div>

      <div class="fc-front">${md(card.front).replace(/^<p>|<\/p>$/g, '')}</div>

      ${drill.flipped ? `
        <div class="fc-back">
          ${card.answer ? `<div class="fc-answer"><code>${esc(card.answer)}</code></div>` : ''}
          <div class="md">${md(card.back)}</div>
        </div>
        <div class="row fc-grades">
          <span class="muted small">Bạn nhớ ra được không?</span>
          <span class="spacer"></span>
          ${GRADES.map((g) => `<button class="btn ghost small" data-grade="${g.id}" title="${esc(g.hint)}">${esc(g.label)}</button>`).join('')}
        </div>`
      : `<div class="row" style="margin-top:16px">
          <button class="btn" id="fc-flip">Lật thẻ</button>
          <span class="muted small">Nghĩ ra câu trả lời trong đầu <strong>trước</strong> khi lật — đoán rồi kiểm tra mới là lúc trí nhớ được củng cố.</span>
        </div>`}
    </div>`;

  if (drill.flipped) {
    $$('[data-grade]').forEach((btn) => btn.addEventListener('click', () => {
      const g = GRADES.find((x) => x.id === btn.dataset.grade);
      const rec2 = gradeCard(card.id, g.quality);
      drill.done++;
      drill.at++;
      drill.flipped = false;
      toast(`${g.label} — ${nextDueLabel(rec2).toLowerCase()}`);
      drawCard();
      updateDeckCards();
    }));
  } else {
    $('#fc-flip').addEventListener('click', () => { drill.flipped = true; drawCard(); });
  }
}

/** Cập nhật lại số thẻ đến hạn trên các thẻ bộ mà không render lại cả trang. */
function updateDeckCards() {
  const st = store.get();
  $$('.deck-card').forEach((el) => {
    const p = deckProgress(el.dataset.deck, st);
    el.querySelector('.deck-due').textContent = p.due;
    el.querySelector('.deck-learned').textContent = `đã học ${p.learned} thẻ`;
    el.querySelector('.bar > i').style.width = `${Math.round((p.learned / Math.max(1, p.total)) * 100)}%`;
  });
  window.dispatchEvent(new CustomEvent('progress-changed'));
}
