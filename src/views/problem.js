import { problemById as jsProblemById, topicById as jsTopicById, buildTests } from '../data/index.js';
import { store } from '../store.js';
import { computeScore, grade, BASE_POINTS, BONUS, HINT_PENALTY } from '../scoring.js';
import { qualityFromScore, schedule, nextDueLabel } from '../srs.js';
import { runTests, benchmark } from '../runner.js';
import { measureTests, perfTier, perfLabel, perfAdvice, perfScope, perfShaky, fmtMs, fmtRatio } from '../perf.js';
import {
  openHint, hintButton, hintPaneNote, needsRevealConfirm, revealSolution,
  revealButtonLabel, revealNote, resetUnlockState,
} from '../unlock.js';
import { md } from '../markdown.js';
import { $, $$, esc, inlineMd, toast, diffClass, diffLabel, bar, hashQuery } from '../ui.js';
import { questionHtml } from '../quiz-format.js';
import { resolveLang, pick } from '../lang.js';
import { createEditor } from '../editor.js';
import { HINTS } from '../hints/index.js';
import { explainError, explainTimeout } from '../error-vi.js';
import { syntaxSectionsHtml } from './reference.js';

const JS_DOMAIN = { problemById: jsProblemById, topicById: jsTopicById, basePath: '' };

let session = null;   // trạng thái phiên làm bài hiện tại

/** Danh sách bài theo đúng thứ tự học, dùng cho điều hướng trước/sau. */
function orderedProblems(domain) {
  return domain.PROBLEMS || [...domain.problemById.values()];
}

/**
 * Đang mở bài này để ÔN TẬP (tới từ trang 🔁 Ôn tập ngắt quãng, link có "?review=1")?
 *
 * Chỉ có ý nghĩa khi có sẵn code cũ để giấu đi — nếu chưa từng viết gì thì hành vi
 * mở bài vẫn như bình thường (không có gì để trở thành "gợi ý" cả).
 */
export function isReviewMode(rec) {
  return hashQuery().get('review') === '1' && !!(rec.code || rec.codePy);
}

export function renderProblem(id, domain = JS_DOMAIN) {
  const { problemById, topicById, basePath } = domain;
  const p = problemById.get(id);
  if (!p) return '<h1>Không tìm thấy bài tập</h1>';

  const rec = store.problem(p.id);
  const topic = topicById.get(p.topic);
  const switchLang = store.get().lang || 'javascript';
  const lang = resolveLang(p, switchLang);
  const isPy = lang === 'python';
  const langLabel = isPy ? 'Python' : 'JavaScript';
  const notReady = switchLang === 'python' && !isPy;   // công tắc muốn Python nhưng bài này chưa có bản Python

  const all = orderedProblems(domain);
  const at = all.findIndex((x) => x.id === p.id);
  const prev = at > 0 ? all[at - 1] : null;
  const next = at >= 0 && at < all.length - 1 ? all[at + 1] : null;

  const marked = store.isBookmarked(p.id);
  const firstArgs = sampleArgs(p);
  const reviewMode = isReviewMode(rec);
  if (reviewMode) {
    // Bắt đầu một lượt ôn tập MỚI: gợi ý & lời giải phải trả điểm lại từ đầu,
    // không được hiện sẵn hoặc ăn ké trạng thái miễn phí có từ lần giải trước.
    resetUnlockState(rec);
    store.save();
  }

  session = {
    problem: p,
    startedAt: Date.now(),
    attempts: 0,
    lastResult: null,
    passedThisSession: false,
  };

  return `
    <div class="row">
      <a class="btn ghost small" href="#${basePath}/topic/${p.topic}">← ${topic.icon} ${esc(topic.name)}</a>
      <span class="badge ${diffClass(p.difficulty)}">${diffLabel(p.difficulty)}</span>
      <span class="badge">🎯 mục tiêu ${p.targetMinutes} phút</span>
      ${rec.solved ? `<span class="badge ok">Đã giải · ${rec.best} điểm</span>` : ''}
      ${rec.perfRatio ? `<span class="badge ${perfTier(rec.perfRatio).tone}" title="Thời gian chạy tốt nhất của bạn so với lời giải tham chiếu">⚡ ${fmtRatio(rec.perfRatio)} lời giải mẫu</span>` : ''}
      ${rec.srs?.due ? `<span class="badge">${nextDueLabel(rec.srs)}</span>` : ''}
      <button class="btn ghost small mark-btn${marked ? ' marked' : ''}" id="mark-btn"
              title="Đánh dấu để xem lại — xuất hiện trong mục Sổ tay">${marked ? '⭐ Đã đánh dấu' : '☆ Đánh dấu'}</button>
      <button class="btn ghost small" id="ref-btn" title="Mở bảng tra cứu cú pháp mà không rời bài">🔎 Tra cứu</button>
      <span class="spacer"></span>
      <span class="muted small" id="timer">00:00</span>
    </div>

    <div id="ref-drawer" class="ref-drawer hidden" aria-label="Tra cứu cú pháp">
      <div class="ref-panel">
        <div class="pane-head">
          <strong>🔎 Tra cứu cú pháp ${langLabel}</strong>
          <span class="spacer"></span>
          <button class="btn ghost small" id="ref-close">Đóng ✕</button>
        </div>
        <div class="pane-body">
          <input id="ref-q" class="search-input" type="search" autocomplete="off"
                 placeholder="🔍 Gõ không dấu: &quot;dem tan suat&quot;, &quot;hang doi&quot;, &quot;sap xep&quot;…" />
          <div id="ref-body" style="margin-top:12px"></div>
          <p class="muted small">Cần cả bảng cấu trúc dữ liệu và đối chiếu JS ↔ Python:
            <a href="#/cheatsheet">mở trang Tra cứu nhanh</a>.</p>
        </div>
      </div>
    </div>

    <h1 style="margin-top:12px">${esc(p.title)}</h1>
    <p class="sub">${esc(p.en)} · Điểm tối đa cơ bản: ${BASE_POINTS[p.difficulty]}</p>
    ${notReady ? '<div class="card" style="border-color:var(--warn);margin-bottom:14px"><strong>🔧 Bài này chưa có bản Python.</strong> <span class="muted small">Đang hiển thị bằng JavaScript — bài sẽ có bản Python trong các đợt cập nhật tiếp theo.</span></div>' : ''}
    ${reviewMode ? `
      <div class="card" style="border-color:var(--accent);margin-bottom:14px">
        <div class="row">
          <strong>🔁 Đang ôn tập</strong>
          <span class="spacer"></span>
          <button class="btn ghost small" id="review-reveal-btn">👁 Xem lời giải trước của bạn</button>
        </div>
        <p class="muted small" style="margin:6px 0 0">Khung code bắt đầu <strong>từ đầu</strong>, không tự điền lại lời giải cũ — hãy thử tự nhớ trước. Giải lại thành công sẽ thay cho lời giải cũ.</p>
      </div>` : ''}

    <div class="workspace">
      <div>
        <div class="pane">
          <div class="pane-head"><strong>📄 Đề bài</strong></div>
          <div class="pane-body md scroll">${md(p.statement)}</div>
        </div>

        <div class="pane" style="margin-top:14px">
          <div class="pane-head">
            <strong>💡 Gợi ý theo bậc</strong>
            <span class="spacer"></span>
            <span class="muted small" id="hint-note">${esc(hintPaneNote(rec, { forcePaid: reviewMode }))}</span>
          </div>
          <div class="pane-body">
            <div id="hints"></div>
            <button class="btn ghost small" id="hint-btn"></button>
          </div>
        </div>

        <div class="pane" style="margin-top:14px">
          <div class="pane-head"><strong>📖 Phân tích &amp; lời giải</strong></div>
          <div class="pane-body">
            <p class="muted small" style="margin-top:0" id="reveal-note">${inlineMd(revealNote(rec, { forcePaid: reviewMode }))}</p>
            <button class="btn ghost small" id="reveal-btn">${revealButtonLabel(rec, { forcePaid: reviewMode })}</button>
            <div id="solution"></div>
          </div>
        </div>

        <details class="pane" style="margin-top:14px">
          <summary class="pane-head">
            <strong>📝 Ghi chú của bạn</strong>
            <span class="spacer"></span>
            <span class="muted small">tự lưu · xem lại ở mục Sổ tay</span>
          </summary>
          <div class="pane-body">
            <textarea id="note" class="note-area" spellcheck="false"
              placeholder="Viết lại bằng lời của bạn: mẫu hình của bài này là gì? mình đã mắc ở đâu? lần sau nhìn dấu hiệu nào để nhận ra?"></textarea>
            <div class="row" style="margin-top:6px"><span class="muted small" id="note-state">&nbsp;</span></div>
          </div>
        </details>
      </div>

      <div>
        <div class="pane">
          <div class="pane-head">
            <strong>⌨️ Lời giải của bạn</strong>
            <span class="badge">${langLabel}</span>
            <span class="spacer"></span>
            <button class="btn ghost small" id="reset-btn">Khôi phục code mẫu</button>
          </div>
          <div id="editor-mount"></div>
        </div>

        <div class="row" style="margin-top:12px">
          <button class="btn" id="run-btn">▶ Chạy &amp; chấm điểm</button>
          <span class="muted small">hoặc <span class="kbd">Ctrl</span> + <span class="kbd">Enter</span></span>
        </div>

        <details class="pane scratch-pane" id="scratch-pane" style="margin-top:14px">
          <summary class="pane-head">
            <strong>🧪 Chạy thử với dữ liệu của bạn</strong>
            <span class="spacer"></span>
            <span class="muted small">không tính điểm</span>
          </summary>
          <div class="pane-body">
            <p class="muted small" style="margin:0 0 8px">Nhập tham số dưới dạng <strong>mảng JSON</strong> — mỗi phần tử là một tham số của
              <code>${esc(p.entry)}</code>, đúng như cột "Đầu vào" của các test bên dưới.</p>
            <textarea id="scratch-input" class="note-area mono" spellcheck="false" rows="2">${esc(firstArgs)}</textarea>
            <div class="row" style="margin-top:8px">
              <button class="btn small" id="scratch-btn">▶ Chạy thử</button>
              <button class="btn ghost small" id="scratch-reset">Lấy lại ví dụ mẫu</button>
            </div>
            <div id="scratch-out" style="margin-top:10px"></div>
          </div>
        </details>

        ${cheatSheet(lang)}
        ${langLabel === 'Python' ? '<p class="muted small" style="margin:8px 0 0">Lần chạy Python đầu tiên trong phiên cần vài giây để tải môi trường (Pyodide, cần internet lần đầu) — các lần sau nhanh hơn nhiều.</p>' : ''}

        <div id="results" style="margin-top:14px"></div>
      </div>
    </div>

    <div class="row prob-nav">
      ${prev ? `<a class="btn ghost small" href="#${basePath}/problem/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
      <span class="spacer"></span>
      ${next ? `<a class="btn ghost small" href="#${basePath}/problem/${next.id}">${esc(next.title)} →</a>` : ''}
    </div>
  `;
}

/** Ví dụ đầu vào cho ô "Chạy thử": lấy từ test đầu tiên nên luôn đúng định dạng. */
function sampleArgs(p) {
  try {
    return JSON.stringify(p.tests?.[0]?.args ?? []);
  } catch {
    return '[]';
  }
}

/** Bảng "cú pháp thường dùng": mỗi ô là một mẫu code bấm vào là chèn thẳng vào editor. */
function cheatSheet(lang) {
  const dict = HINTS[lang] || HINTS.python;
  const title = lang === 'python' ? '🧩 Cú pháp Python thường dùng' : '🧩 Cú pháp JavaScript thường dùng';
  return `
    <details class="pane cheat-pane" style="margin-top:14px" open>
      <summary class="pane-head">
        <strong>${title}</strong>
        <span class="spacer"></span>
        <span class="muted small">bấm để chèn vào chỗ con trỏ</span>
      </summary>
      <div class="pane-body cheats">
        ${dict.snippets.map((g, gi) => `
          <div class="cheat-group">
            <div class="cheat-title">${esc(g.group)}</div>
            <div class="chips">
              ${g.items.map((it, ii) => `<button type="button" class="chip" data-g="${gi}" data-i="${ii}"
                 title="${esc(it.detail || '')}${it.doc ? '\n' + esc(it.doc) : ''}${it.ex?.length ? '\n\nVí dụ: ' + esc(it.ex[0]) : ''}">${esc(it.label)}</button>`).join('')}
            </div>
          </div>`).join('')}
        <p class="muted small" style="margin:10px 0 0">Trong lúc gõ, bảng gợi ý tự hiện sau ký tự đầu tiên (hoặc bấm <span class="kbd">Ctrl</span>+<span class="kbd">Space</span>); <span class="kbd">Tab</span> để chọn, <span class="kbd">Esc</span> để đóng. Mỗi gợi ý kèm chữ ký hàm và giải thích ngắn.
          Cần tra kỹ hơn: <a href="#/cheatsheet">🔎 Tra cứu nhanh</a>.</p>
      </div>
    </details>`;
}

/* --------------------------- gắn sự kiện --------------------------- */
export function mountProblem(id, domain = JS_DOMAIN) {
  const { problemById } = domain;
  const p = problemById.get(id);
  if (!p) return;
  const lang = resolveLang(p, store.get().lang || 'javascript');
  const isPy = lang === 'python';
  const starter = pick(p, 'starter', lang);
  const hints = pick(p, 'hints', lang);
  const diagnostics = pick(p, 'diagnostics', lang) || [];
  const rec = store.problem(p.id);
  // Phiên của ĐÚNG lần mở bài này: việc chạy nền (đo hiệu năng) có thể trả kết quả
  // sau khi người học đã sang bài khác — lúc đó không được ghi vào phiên mới.
  const sess = session;
  // `let` vì bị TẮT ngay khi người học tự giải lại thành công (xem onPass): từ lúc đó
  // gợi ý/lời giải quay về miễn phí như một bài đã giải bình thường, và editor lại tự
  // lưu theo từng ký tự gõ — giống hệt hành vi ngoài chế độ ôn tập.
  let reviewMode = isReviewMode(rec);
  // Bấm "xem lời giải trước" thì tắt hành vi "giữ nguyên code cũ" cho phần còn lại của
  // phiên này — đã nhìn code cũ rồi thì lần pass tiếp theo không còn là "tự nhớ được" nữa.
  let revealedOld = false;

  const editor = createEditor({
    mount: $('#editor-mount'),
    value: (reviewMode ? '' : (isPy ? rec.codePy : rec.code)) || starter,
    lang,
    onChange: (v) => {
      // Đang ôn tập mà chưa xem lại code cũ: KHÔNG ghi đè lời giải cũ bằng bản đang gõ dở.
      // Nếu ghi ngay từ ký tự đầu tiên, code cũ (đã từng chạy đúng) sẽ mất ngay cả khi
      // người học bỏ dở giữa chừng — điều đó tệ hơn cả việc không có tính năng này.
      if (reviewMode && !revealedOld) return;
      if (isPy) rec.codePy = v; else rec.code = v;
      store.save();
    },
    onRun: () => run(),
  });

  $('#review-reveal-btn')?.addEventListener('click', () => {
    if (!confirm('Xem lại code cũ sẽ không còn tính là bạn tự nhớ được, và điểm của lượt ôn này sẽ bị giới hạn ở 30% — y như xem lời giải tham chiếu. Vẫn xem chứ?')) return;
    revealedOld = true;
    // Xem code cũ của chính mình cũng là một dạng "xem đáp án" — tính điểm y như
    // bấm "Xem phân tích & lời giải", không có đường tắt riêng cho việc này.
    revealSolution(rec, { forcePaid: reviewMode });
    store.save();
    editor.value = (isPy ? rec.codePy : rec.code) || starter;
    $('#review-reveal-btn').remove();
    toast('Đây là code bạn đã viết trước đó — đọc xong hãy thử gõ lại bằng lời của mình.');
  });

  // bảng cú pháp: bấm một mẫu là chèn vào vị trí con trỏ
  const dict = HINTS[lang] || HINTS.python;
  $$('.cheats .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const it = dict.snippets[+chip.dataset.g]?.items[+chip.dataset.i];
      if (it) editor.insertSnippet(it.insert || it.label);
    });
  });

  // timer
  const timerEl = $('#timer');
  const tick = setInterval(() => {
    if (!document.body.contains(timerEl)) { clearInterval(tick); editor.destroy(); return; }
    const s = Math.floor((Date.now() - sess.startedAt) / 1000);
    timerEl.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }, 1000);

  $('#reset-btn').addEventListener('click', () => {
    if (!confirm('Khôi phục về code mẫu? Code hiện tại sẽ mất.')) return;
    editor.value = starter;
  });

  $('#run-btn').addEventListener('click', run);

  /* ----- đánh dấu ----- */
  const markBtn = $('#mark-btn');
  markBtn.addEventListener('click', () => {
    const on = store.toggleBookmark(p.id);
    markBtn.classList.toggle('marked', on);
    markBtn.textContent = on ? '⭐ Đã đánh dấu' : '☆ Đánh dấu';
    toast(on ? 'Đã đánh dấu — xem lại ở mục 📔 Sổ tay.' : 'Đã bỏ đánh dấu.');
  });

  /* ----- panel tra cứu trượt ra, không phải rời bài ----- */
  const drawer = $('#ref-drawer');
  const refBody = $('#ref-body');
  const refQ = $('#ref-q');
  // Truyền module của bài -> cú pháp của đúng module đang học được đưa lên đầu panel
  const drawRef = () => { refBody.innerHTML = syntaxSectionsHtml(lang, refQ.value, p.topic); };

  $('#ref-btn').addEventListener('click', () => {
    drawer.classList.remove('hidden');
    if (!refBody.innerHTML) drawRef();
    refQ.focus();
  });
  const closeRef = () => drawer.classList.add('hidden');
  $('#ref-close').addEventListener('click', closeRef);
  drawer.addEventListener('mousedown', (e) => { if (e.target === drawer) closeRef(); });
  refQ.addEventListener('input', drawRef);
  refQ.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeRef(); });

  /* ----- ghi chú ----- */
  const noteEl = $('#note');
  const noteState = $('#note-state');
  noteEl.value = store.noteText(p.id);
  let noteTimer = null;
  noteEl.addEventListener('input', () => {
    clearTimeout(noteTimer);
    noteState.textContent = 'đang lưu…';
    noteTimer = setTimeout(() => {
      store.setNote(p.id, noteEl.value);
      noteState.textContent = 'đã lưu ✓';
      setTimeout(() => { if (noteState.textContent === 'đã lưu ✓') noteState.innerHTML = '&nbsp;'; }, 1600);
    }, 500);
  });

  // ----- gợi ý -----
  renderHints();
  $('#hint-btn').addEventListener('click', () => {
    const { opened, level, free } = openHint(rec, hints.length, { forcePaid: reviewMode });
    if (!opened) return;
    store.save();
    renderHints();
    toast(free
      ? `Đã mở gợi ý ${level}/${hints.length} — miễn phí, điểm của bài không đổi.`
      : `Đã mở gợi ý ${level}/${hints.length} — điểm tối đa giảm còn ${Math.round((1 - HINT_PENALTY[level]) * 100)}%`);
  });

  function renderHints() {
    const box = $('#hints');
    box.innerHTML = hints.slice(0, rec.hintsOpen)
      .map((h, i) => `<div class="hint"><strong>Gợi ý ${i + 1}.</strong> ${md(h).replace(/^<p>|<\/p>$/g, '')}</div>`)
      .join('');
    const btn = $('#hint-btn');
    const state = hintButton(rec, hints.length, { forcePaid: reviewMode });
    btn.textContent = state.label;
    btn.disabled = state.disabled;
    $('#hint-note').textContent = hintPaneNote(rec, { forcePaid: reviewMode });
  }

  // ----- lời giải -----
  $('#reveal-btn').addEventListener('click', () => {
    if (needsRevealConfirm(rec, { forcePaid: reviewMode })
      && !confirm('Xem lời giải sẽ giới hạn điểm bài này ở 30%. Tiếp tục?\n\nMẹo: pass hết test trước thì phần này mở miễn phí.')) return;
    revealSolution(rec, { forcePaid: reviewMode });
    store.save();
    $('#reveal-btn').classList.add('hidden');
    const primarySolution = pick(p, 'solution', lang);
    const otherLangBlock = p.lang === 'python'
      ? ''   // bài thuộc track Python thuần tuý -> không có bản JS để đối chiếu
      : (isPy
        ? `<h3>Lời giải tham khảo (JavaScript)</h3><div class="md">${md('```js\n' + p.solution + '\n```')}</div>`
        : `<h3>Lời giải tham khảo (Python)</h3><div class="md">${md('```python\n' + p.solutionPy + '\n```')}</div>`);
    $('#solution').innerHTML = `
      <div class="md">${md(p.approach)}</div>
      <h3>Lời giải tham khảo (${isPy ? 'Python' : 'JavaScript'})</h3>
      <div class="md">${md('```' + (isPy ? 'python' : 'js') + '\n' + primarySolution + '\n```')}</div>
      ${yourCodeBlock()}
      ${otherLangBlock}
      <div class="hint md"><strong>🌍 Ứng dụng thực tế.</strong> ${inlineMd(p.realWorld)}</div>`;
  });

  /** Đã giải xong -> đặt code của người học ngay cạnh lời giải tham chiếu để so từng dòng
   *  (kèm thời gian đo được, nếu đã đo). Chưa giải thì không hiện: đang đọc gợi ý chứ
   *  không phải đang so sánh. */
  function yourCodeBlock() {
    if (!rec.solved || !sess.code) return '';
    const times = sess.perf
      ? ` <span class="muted small">— của bạn ${fmtMs(sess.perf.ours.ms)} · tham chiếu ${fmtMs(sess.perf.ref.ms)}</span>`
      : '';
    return `<h3>Lời giải của bạn${times}</h3>
      <div class="md">${md('```' + (isPy ? 'python' : 'js') + '\n' + sess.code + '\n```')}</div>`;
  }

  /** Sau khi pass hết test: gợi ý và lời giải chuyển sang chế độ miễn phí. */
  function unlockPanes() {
    renderHints();
    const note = $('#reveal-note');
    if (note) note.innerHTML = inlineMd(revealNote(rec, { forcePaid: reviewMode }));
    const btn = $('#reveal-btn');
    if (btn && !btn.classList.contains('hidden')) btn.textContent = revealButtonLabel(rec, { forcePaid: reviewMode });
  }

  /** Mở (hoặc cuộn tới) khung lời giải — dùng cho nút trong thẻ hiệu năng. */
  function showSolution() {
    const btn = $('#reveal-btn');
    if (btn && !btn.classList.contains('hidden')) btn.click();
    $('#solution')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ------------------- chạy thử với dữ liệu tự nhập ------------------- */
  $('#scratch-reset').addEventListener('click', () => { $('#scratch-input').value = sampleArgs(p); });

  $('#scratch-btn').addEventListener('click', async () => {
    const raw = $('#scratch-input').value.trim();
    const out = $('#scratch-out');

    let args;
    try {
      args = JSON.parse(raw);
    } catch {
      out.innerHTML = badInputCard(p, 'Không đọc được dữ liệu — đây phải là JSON hợp lệ.');
      return;
    }
    if (!Array.isArray(args)) {
      out.innerHTML = badInputCard(p, 'Dữ liệu phải là một <strong>mảng</strong> các tham số, kể cả khi hàm chỉ nhận một tham số.');
      return;
    }

    const btn = $('#scratch-btn');
    btn.disabled = true;
    btn.textContent = '⏳ Đang chạy...';
    const res = await runTests({
      code: editor.value,
      entry: p.entry,
      tests: [{ args, scratch: true, name: 'Chạy thử' }],
      harnessSrc: pick(p, 'harnessSrc', lang),
      checkerSrc: pick(p, 'checkerSrc', lang),
      timeoutMs: 6000,
      lang,
    });
    btn.disabled = false;
    btn.textContent = '▶ Chạy thử';

    if (!res.ok) {
      out.innerHTML = phaseErrorCard(res, lang, p.id, editor.value);
      return;
    }
    const r = res.results[0];
    out.innerHTML = `
      <div class="card tight" style="border-color:${r.error ? 'var(--bad)' : 'var(--accent)'}">
        <div class="row"><strong>${r.error ? '❌ Lỗi khi chạy' : '↩ Hàm trả về'}</strong>
          <span class="spacer"></span><span class="muted small">${r.ms} ms</span></div>
        ${r.error ? '' : `<pre class="mono small out-val">${esc(r.got)}</pre>`}
      </div>
      ${r.error ? errorBlock(r.error, r.errorLine, lang, p.id, editor.value) : ''}
      ${logsBlock(r.logs, isPy)}
      ${traceBlock(r.trace, lang)}`;
  });

  function badInputCard(prob, msg) {
    return `<div class="card tight" style="border-color:var(--warn)">
      <strong>⚠️ Dữ liệu chưa hợp lệ</strong>
      <p class="small" style="margin:6px 0">${msg}</p>
      <p class="muted small" style="margin:0">Ví dụ đúng cho bài này: <code>${esc(sampleArgs(prob))}</code></p>
    </div>`;
  }

  /* --------------------------- chạy test --------------------------- */
  async function run() {
    const btn = $('#run-btn');
    btn.disabled = true;
    btn.textContent = isPy ? '⏳ Đang chạy (lần đầu có thể mất vài giây để tải môi trường Python)...' : '⏳ Đang chạy...';
    const code = editor.value;

    const res = await runTests({
      code,
      entry: p.entry,
      tests: buildTests(p),
      harnessSrc: pick(p, 'harnessSrc', lang),
      checkerSrc: pick(p, 'checkerSrc', lang),
      timeoutMs: 6000,
      lang,
    });

    btn.disabled = false;
    btn.textContent = '▶ Chạy & chấm điểm';

    sess.attempts++;
    rec.attempts++;
    rec.lastRun = Date.now();
    store.save();

    const passed = res.ok && res.results.every((r) => r.pass);
    if (passed) onPass(code, res);
    else onFail(code, res);
  }

  /** Chạy lại MỘT test để gỡ lỗi. Không tính lượt thử, không chấm điểm. */
  async function runOne(index) {
    const all = buildTests(p);
    const t = all[index];
    if (!t) return;
    const card = $(`.test[data-i="${index}"]`);
    if (card) card.classList.add('running');

    const res = await runTests({
      code: editor.value,
      entry: p.entry,
      tests: [t],
      harnessSrc: pick(p, 'harnessSrc', lang),
      checkerSrc: pick(p, 'checkerSrc', lang),
      timeoutMs: 6000,
      lang,
    });

    if (!card) return;
    card.classList.remove('running');
    if (!res.ok) {
      card.outerHTML = `<div class="test fail" data-i="${index}">
        <div class="row"><span>❌</span><strong>Test ${index + 1}${t.name ? ' — ' + esc(t.name) : ''}</strong>
          <span class="spacer"></span>${runOneBtn(index)}</div>
        ${phaseErrorCard(res, lang, p.id, editor.value)}
      </div>`;
      return;
    }
    // giữ đúng chỉ số hiển thị của test gốc
    card.outerHTML = testCard({ ...res.results[0], i: index }, index, lang, isPy, p.id, editor.value, true);
  }

  // Bấm ▶ trên một dòng test, hoặc "Nhảy tới dòng N" ở thẻ giải thích lỗi.
  // Gắn trên #results / #scratch-pane (hai phần tử này bị xoá khi rời trang nên không tích tụ listener).
  [$('#results'), $('#scratch-pane')].forEach((root) => {
    root.addEventListener('click', (e) => {
      const rerun = e.target.closest('[data-run-one]');
      if (rerun) { runOne(Number(rerun.dataset.runOne)); return; }
      const jump = e.target.closest('[data-goto-line]');
      if (jump) { editor.gotoLine(Number(jump.dataset.gotoLine)); return; }
      const ins = e.target.closest('[data-insert-trace]');
      if (ins) {
        editor.insertSnippet(isPy ? 'trace()' : 'trace({  })');
        toast('Đã chèn trace() — điền các biến bạn muốn theo dõi rồi chạy lại.');
      }
    });
  });

  function onFail(code, res) {
    const box = $('#results');
    if (session !== sess || !box) return;   // đã rời trang trong lúc chạy
    let head = '';

    if (!res.ok) {
      head = phaseErrorCard(res, lang, p.id, code);
    } else {
      const pass = res.results.filter((r) => r.pass).length;
      head = `<div class="card" style="border-color:var(--bad)">
        <div class="row"><strong style="color:var(--bad)">❌ ${pass}/${res.results.length} test đạt</strong>
        <span class="spacer"></span><span class="muted small">${res.totalMs} ms</span></div>
      </div>`;

      // Lỗi runtime của test sai đầu tiên cũng được giải thích + tính vào "lỗi hay mắc"
      const firstErr = res.results.find((r) => !r.pass && r.error);
      if (firstErr) {
        head += errorBlock(firstErr.error, firstErr.errorLine, lang, p.id, code);
      }
    }

    box.innerHTML = head
      + diagnose(code, res, diagnostics)
      + (res.logs?.length ? `<div class="card tight" style="margin-top:10px"><div class="muted small">${isPy ? 'print()' : 'console.log'} ở cấp ngoài hàm</div><pre class="mono small" style="white-space:pre-wrap;margin:4px 0 0">${esc(res.logs.join('\n'))}</pre></div>` : '')
      + traceHintCard(res, lang)
      + testList(res, lang, isPy, p.id, code);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function onPass(code, res) {
    const first = rec.attempts === 1;
    if (first) rec.firstTry = true;
    sess.passedThisSession = true;
    sess.elapsed = Date.now() - sess.startedAt;
    sess.code = code;

    // Đánh giá "có thực sự tự nhớ được không" TRƯỚC khi tắt chế độ ôn tập: phải xét
    // đúng những gì xảy ra TRONG lượt ôn này — không xem code cũ, không mở gợi ý,
    // không xem lời giải tham chiếu.
    const rememberedFromScratch = reviewMode && !revealedOld && !rec.hintsUsed && !rec.revealed;
    // Từ đây trở đi: gợi ý & lời giải quay lại MIỄN PHÍ (y như một bài đã giải bình
    // thường), và editor tiếp tục tự lưu theo từng ký tự gõ — đúng hành vi ngoài
    // chế độ ôn tập, vì lời giải MỚI này giờ là lời giải chính thức của bài.
    reviewMode = false;

    // Ở chế độ ôn tập, onChange cố tình KHÔNG ghi vào rec.code/rec.codePy khi đang gõ
    // (xem mountProblem) để giữ nguyên lời giải cũ phòng khi bỏ dở. Giờ đã pass thật rồi
    // thì lời giải mới thay cho lời giải cũ — đúng tinh thần "đã tự nhớ lại được".
    if (isPy) rec.codePy = code; else rec.code = code;

    const sc = scoreNow();
    applyScore(sc.score, 'solve');

    // Rời trang giữa lúc chạy (lượt Python mất vài giây) thì không còn chỗ để vẽ —
    // nhưng điểm ở trên ĐÃ được ghi rồi, đó mới là thứ không được phép mất.
    const box = $('#results');
    if (session !== sess || !box) return;

    box.innerHTML = `
      <div class="card" style="border-color:var(--ok)">
        <div class="row"><strong style="color:var(--ok)">✅ Toàn bộ ${res.results.length} test đều đạt!</strong>
          <span class="spacer"></span><span class="muted small">${res.totalMs} ms</span></div>
        ${rememberedFromScratch ? '<p class="small" style="margin:8px 0 0;color:var(--ok)">🔁 Ôn tập thành công — bạn vừa tự giải lại được mà không nhìn code cũ. Trí nhớ dài hạn được củng cố chính là ở bước này.</p>' : ''}
        <div id="score-card">${scoreBreakdown(sc, rec)}</div>
      </div>
      <div id="perf" style="margin-top:12px">${perfCard({ state: 'running' })}</div>
      <div id="cx" style="margin-top:12px">${complexityCard(p)}</div>
      ${nextUpCard(p, domain)}
      ${testList(res, lang, isPy, p.id, code)}`;

    unlockPanes();       // giải xong rồi -> gợi ý & lời giải miễn phí từ đây
    bindComplexity();
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    measurePerf();
  }

  /** Điểm hiện tại của bài, tính lại từ đầu mỗi lần có thêm dữ kiện (hiệu năng,
   *  câu hỏi độ phức tạp). Chỉ có MỘT chỗ dựng tham số để hai luồng không lệch nhau. */
  function scoreNow() {
    return computeScore({
      difficulty: p.difficulty,
      hintsUsed: rec.hintsUsed,
      revealed: rec.revealed,
      firstTry: !!rec.firstTry,
      elapsedMs: sess.elapsed,
      targetMinutes: p.targetMinutes,
      complexityCorrect: !!sess.complexityCorrect,
      perfRatio: sess.perfRatio ?? null,
    });
  }

  /* --------------------------- đo hiệu năng --------------------------- */
  /**
   * Chạy code vừa pass CẠNH lời giải tham chiếu để lấy tỉ lệ thời gian, rồi cộng
   * mức thưởng hiệu năng. Chạy nền: không chặn phần còn lại của màn hình kết quả.
   */
  async function measurePerf() {
    const refCode = pick(p, 'solution', lang);
    const tests = measureTests(p, buildTests(p));
    if (!refCode || !tests.length) {
      if (session === sess) $('#perf')?.remove();
      return;
    }

    const res = await benchmark({
      code: sess.code,
      refCode,
      entry: p.entry,
      tests,
      harnessSrc: pick(p, 'harnessSrc', lang),
      lang,
    });

    if (session !== sess) return;            // người học đã sang bài khác
    const box = $('#perf');
    if (!box) return;

    if (!res?.ok || !(res.ratio > 0)) {
      // Hết giờ khi đo trên dữ liệu lớn CHÍNH LÀ câu trả lời: lời giải tham chiếu
      // chạy xong bộ dữ liệu này trong vài mili-giây (đã kiểm tra ở tools/test-bench*),
      // nên bên không chạy nổi là code của người học.
      const tooSlow = res?.phase === 'timeout' && perfScope(tests).big;
      box.innerHTML = perfCard({
        state: tooSlow ? 'tooSlow' : 'error',
        error: res?.error || 'Không đo được thời gian chạy.',
        tests,
      });
      bindPerf();
      return;
    }

    sess.perf = res;
    sess.perfRatio = res.ratio;
    rec.perfRatio = rec.perfRatio ? Math.min(rec.perfRatio, res.ratio) : res.ratio;
    rec.perfAt = Date.now();

    const sc = scoreNow();
    applyScore(sc.score, 'perf');
    const card = $('#score-card');
    if (card) card.innerHTML = scoreBreakdown(sc, rec);
    box.innerHTML = perfCard({ state: 'done', res, tests });
    bindPerf();
  }

  function bindPerf() {
    const box = $('#perf');
    if (!box) return;
    // Đo lại đúng đoạn code ĐÃ PASS, không lấy nội dung editor hiện tại: nếu không,
    // chỉ cần sửa thành `return 0` rồi bấm đo lại là ăn thưởng hiệu năng bằng code sai.
    box.querySelector('[data-perf-again]')?.addEventListener('click', () => {
      box.innerHTML = perfCard({ state: 'running' });
      measurePerf();
    });
    box.querySelector('[data-show-solution]')?.addEventListener('click', showSolution);
  }

  function applyScore(score, kind) {
    const prevBest = rec.best || 0;
    if (score > prevBest) {
      store.addXp(score - prevBest, { type: kind, ref: p.id });
      rec.best = score;
    } else {
      store.touchStreak();
    }
    if (!rec.solved) rec.solved = true;
    const q = qualityFromScore(rec.best, BASE_POINTS[p.difficulty]);
    rec.srs = schedule(rec.srs, q);
    store.save();
  }

  function bindComplexity() {
    const box = $('#cx');
    if (!box) return;
    $$('.opt', box).forEach((opt) => {
      opt.addEventListener('click', () => {
        if (box.dataset.answered) return;
        box.dataset.answered = '1';
        const chosen = Number(opt.dataset.i);
        const correct = p.complexity.answer;
        $$('.opt', box).forEach((o, i) => {
          if (i === correct) o.classList.add('correct');
          else if (i === chosen) o.classList.add('wrong');
        });

        if (chosen === correct) {
          sess.complexityCorrect = true;
          const sc = scoreNow();
          applyScore(sc.score, 'complexity');
          const card = $('#score-card');
          if (card) card.innerHTML = scoreBreakdown(sc, rec);
          toast(`Chính xác! +10% thưởng phân tích độ phức tạp. Tổng điểm bài này: ${rec.best}`);
        } else {
          toast('Chưa đúng — đọc kỹ phần giải thích bên dưới nhé.');
        }

        const g = grade(rec.best, p.difficulty);
        box.insertAdjacentHTML('beforeend', `
          <div class="hint md"><strong>Giải thích.</strong> ${inlineMd(p.complexity.why)}</div>
          <div class="row" style="margin-top:10px">
            <span class="badge ${g.color}">Xếp hạng ${g.letter}</span>
            <span class="muted small">${esc(g.text)} · ${rec.best}/${BASE_POINTS[p.difficulty]} điểm</span>
            <span class="spacer"></span>
            <span class="badge">${nextDueLabel(rec.srs)}</span>
          </div>
          <div class="hint md" style="border-left-color:var(--ok)"><strong>🌍 Ứng dụng thực tế.</strong> ${inlineMd(p.realWorld)}</div>
          ${rec.solutionSeen ? '' : '<p class="small muted">Chưa xem phần <strong>Phân tích &amp; lời giải</strong>? Giờ là lúc nên đọc — nó nói về <em>mẫu hình</em> đằng sau bài này, thứ sẽ quay lại ở các bài khó hơn. Bạn đã pass hết test nên đọc <strong>không bị trừ điểm</strong>.</p>'}
        `);
        store.save();
      });
    });
  }
}

/* --------------------------- thành phần phụ --------------------------- */
function complexityCard(p) {
  return `
    <div class="quiz-q">
      <div class="q-text md">${questionHtml(p.complexity.question, { lang: resolveLang(p, store.get().lang), prefix: '**🧠 Câu hỏi cuối:**' })}</div>
      <p class="muted small" style="margin:6px 0 10px">Trả lời đúng được cộng thêm 10% điểm. Giải được bài mà không biết nó tốn bao nhiêu thì chưa xong việc.</p>
      <div class="opts">
        ${p.complexity.options.map((o, i) => `<div class="opt" data-i="${i}"><span class="opt-k">${'ABCD'[i]}.</span><span>${inlineMd(o)}</span></div>`).join('')}
      </div>
    </div>`;
}

/** Gợi ý bài tiếp theo ngay sau khi giải xong — đỡ phải quay ra danh sách tìm. */
function nextUpCard(p, domain) {
  const all = orderedProblems(domain);
  const at = all.findIndex((x) => x.id === p.id);
  const next = at >= 0 ? all[at + 1] : null;
  if (!next) return '';
  const st = store.get();
  return `<div class="card tight" style="margin-top:12px">
    <div class="row">
      <span class="muted small">Bài tiếp theo trong lộ trình</span>
      <span class="spacer"></span>
      <a class="btn small" href="#${domain.basePath || ''}/problem/${next.id}">${st.problems[next.id]?.solved ? '✅ ' : ''}${esc(next.title)} →</a>
    </div>
  </div>`;
}

function scoreBreakdown(sc, rec) {
  const tone = (d) => {
    if (d === null) return 'var(--warn)';        // bị chặn trần
    if (d > 0) return 'var(--ok)';
    if (d === 0) return 'var(--muted)';          // có mục đó nhưng không được thưởng
    return 'var(--bad)';
  };
  return `
    <div style="margin-top:10px">
      <div class="row"><span class="muted small">Điểm nhận được</span><span class="spacer"></span><strong>${sc.score} / ${sc.base}</strong></div>
      ${sc.parts.map((pt) => `<div class="row small" style="color:${tone(pt.delta)}">
        <span>${esc(pt.label)}</span><span class="spacer"></span>
        <span>${pt.delta === null ? '↓ trần 30%' : (pt.delta > 0 ? '+' : '') + Math.round(pt.delta * 100) + '%'}</span></div>`).join('')}
      ${rec.best ? `<div class="row small muted"><span>Điểm cao nhất của bài này</span><span class="spacer"></span><span>${rec.best}</span></div>` : ''}
    </div>`;
}

/* ------------------------------ thẻ hiệu năng ------------------------------ */
/**
 * Giải đúng chưa phải là xong: thẻ này trả lời câu "code của mình có nhanh không?"
 * bằng cách so trực tiếp với lời giải tham chiếu của chính bài đó (xem src/perf.js).
 */
function perfCard({ state, res = null, tests = [], error = '' }) {
  if (state === 'running') {
    return `<div class="card tight perf-card">
      <div class="row"><strong>⚡ Đang đo hiệu năng…</strong>
        <span class="spacer"></span><span class="muted small">chạy code của bạn cạnh lời giải tham chiếu</span></div>
      <p class="muted small" style="margin:6px 0 0">Cả hai bên chạy nhiều lượt trên cùng dữ liệu rồi lấy lượt nhanh nhất — mất khoảng một giây.</p>
    </div>`;
  }

  if (state === 'tooSlow') {
    const big = tests.map((t) => t.name).filter(Boolean).join(', ');
    return `<div class="card tight perf-card" style="border-color:var(--bad)">
      <div class="row">
        <strong>⚡ Hiệu năng</strong>
        <span class="badge hard">Quá chậm để đo</span>
        <span class="spacer"></span>
        <span class="muted small">không có thưởng</span>
      </div>
      <p class="perf-verdict">Lời giải của bạn <strong>đúng</strong> trên bộ test của bài, nhưng không chạy nổi bộ dữ liệu lớn
        ${big ? `(${esc(big)})` : ''} — trong khi lời giải tham chiếu xong nó trong vài mili-giây.</p>
      <div class="hint md" style="border-left-color:var(--bad)">${inlineMd('Đây chính là câu trả lời cho câu hỏi "code của mình có nhanh không?": **độ phức tạp chưa đúng**, chứ không phải máy chậm. Với dữ liệu lớn, chênh lệch giữa O(n) và O(n²) không phải "chậm hơn vài lần" mà là "không bao giờ xong". Hãy đọc lại gợi ý và đổi cách tiếp cận.')}</div>
      <div class="row" style="margin-top:10px">
        <button class="btn ghost small" data-perf-again="1" title="Đo lại đúng đoạn code vừa pass">⚡ Đo lại</button>
        <button class="btn ghost small" data-show-solution="1">📖 Xem lời giải tham chiếu (miễn phí)</button>
      </div>
    </div>`;
  }

  if (state === 'error') {
    return `<div class="card tight perf-card">
      <div class="row"><strong>⚡ Hiệu năng: chưa đo được</strong>
        <span class="spacer"></span>
        <button class="btn ghost tiny" data-perf-again="1">Đo lại</button></div>
      <p class="muted small" style="margin:6px 0 0">${esc(error)}</p>
      <p class="muted small" style="margin:6px 0 0">Điểm của bạn không bị ảnh hưởng — mức thưởng hiệu năng chỉ là phần cộng thêm.</p>
    </div>`;
  }

  const tier = perfTier(res.ratio);
  const scope = perfScope(tests);
  const worst = Math.max(res.ours.ms, res.ref.ms) || 1;
  const shaky = perfShaky(res.ours.ms, res.ref.ms);
  const faster = res.ratio < 1;
  const gap = faster ? 1 / res.ratio : res.ratio;

  return `<div class="card tight perf-card">
    <div class="row">
      <strong>⚡ Hiệu năng</strong>
      <span class="badge ${tier.tone}">${esc(perfLabel(tier, scope.big))}</span>
      <span class="spacer"></span>
      <span class="muted small">${tier.credit > 0 ? `+${Math.round(BONUS.perf * tier.credit * 100)}% điểm` : 'không có thưởng'}</span>
    </div>

    <div class="perf-rows">
      <div class="perf-row">
        <span class="who">Code của bạn</span>
        ${bar((res.ours.ms / worst) * 100, true)}
        <span class="t mono">${fmtMs(res.ours.ms)}</span>
      </div>
      <div class="perf-row">
        <span class="who">Lời giải tham chiếu</span>
        ${bar((res.ref.ms / worst) * 100, true)}
        <span class="t mono">${fmtMs(res.ref.ms)}</span>
      </div>
    </div>

    <p class="perf-verdict">Code của bạn <strong>${faster ? 'nhanh hơn' : 'chậm hơn'} ${fmtRatio(gap)}</strong>
      so với lời giải tham chiếu <span class="muted small">(${res.tests} test · mỗi bên chạy ${res.ours.inner * res.ours.passes} lượt, lấy lượt nhanh nhất)</span></p>

    <div class="hint md" style="border-left-color:${tier.credit > 0 ? 'var(--ok)' : 'var(--warn)'}">${inlineMd(perfAdvice(tier, scope.big))}</div>
    <p class="muted small" style="margin:8px 0 0">${inlineMd(scope.note)}</p>
    ${shaky ? '<p class="muted small" style="margin:6px 0 0">Thời gian đo được ở mức micro-giây nên chênh lệch nhỏ chỉ là nhiễu — chỉ nên tin những khác biệt lớn.</p>' : ''}

    <div class="row" style="margin-top:10px">
      <button class="btn ghost small" data-perf-again="1" title="Đo lại đúng đoạn code vừa pass">⚡ Đo lại</button>
      <button class="btn ghost small" data-show-solution="1">📖 Xem lời giải tham chiếu (miễn phí)</button>
    </div>
  </div>`;
}

const runOneBtn = (i) => `<button class="btn ghost tiny" data-run-one="${i}" title="Chạy lại riêng test này (không tính điểm)">▶ chạy lại</button>`;

/** Log của riêng một test. */
function logsBlock(logs, isPy) {
  if (!logs?.length) return '';
  return `<div class="logs">
    <div class="k">${isPy ? 'print()' : 'console.log'} của test này</div>
    <pre>${esc(logs.join('\n'))}</pre>
  </div>`;
}

/**
 * Bảng theo dõi biến: mỗi lần gọi trace(...) là một dòng, ô nào đổi giá trị so với
 * bước trước thì tô sáng — đây là chỗ thuật toán thôi làm "hộp đen".
 */
function traceBlock(trace, lang) {
  if (!trace?.rows?.length) return '';
  const MAX_COLS = 8;
  const MAX_ROWS = 200;

  const cols = [];
  for (const r of trace.rows) {
    for (const k of Object.keys(r.values || {})) if (!cols.includes(k)) cols.push(k);
  }
  const shown = cols.slice(0, MAX_COLS);
  const rows = trace.rows.slice(0, MAX_ROWS);
  const hasLabel = rows.some((r) => r.label);

  let prev = {};
  const body = rows.map((r, i) => {
    const cells = shown.map((c) => {
      const v = r.values?.[c];
      const changed = v !== undefined && prev[c] !== undefined && prev[c] !== v;
      const fresh = v !== undefined && prev[c] === undefined && i > 0;
      return `<td class="${changed || fresh ? 'chg' : ''}">${v === undefined ? '<span class="muted">·</span>' : esc(v)}</td>`;
    }).join('');
    prev = { ...prev, ...(r.values || {}) };
    return `<tr><td class="step">${i + 1}</td>${hasLabel ? `<td class="lbl">${esc(r.label || '')}</td>` : ''}${cells}</tr>`;
  }).join('');

  return `<div class="card tight trace-card" style="margin-top:10px">
    <div class="row">
      <strong>🔍 Theo dõi biến</strong>
      <span class="spacer"></span>
      <span class="muted small">${trace.total} bước${trace.truncated ? ` · chỉ hiện ${rows.length} bước đầu` : ''}</span>
    </div>
    <div class="trace-wrap">
      <table class="trace">
        <thead><tr><th class="step">#</th>${hasLabel ? '<th class="lbl">bước</th>' : ''}${shown.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    ${cols.length > MAX_COLS ? `<p class="muted small" style="margin:8px 0 0">Chỉ hiện ${MAX_COLS} biến đầu (bỏ qua: ${esc(cols.slice(MAX_COLS).join(', '))}).</p>` : ''}
    <p class="muted small" style="margin:8px 0 0">Ô <span class="chg-demo">tô sáng</span> là giá trị vừa thay đổi so với bước trước.
      ${lang === 'python' ? 'Gọi <code>trace(i=i, l=l)</code>' : 'Gọi <code>trace({ i, l })</code>'} ở bất cứ đâu trong code để thêm bước.</p>
  </div>`;
}

/** Chưa dùng trace mà đang bế tắc -> mách nước một lần, kèm nút chèn sẵn. */
function traceHintCard(res, lang) {
  const anyTrace = res.results?.some((r) => r.trace?.rows?.length);
  if (anyTrace || !res.results?.length) return '';
  return `<div class="card tight" style="margin-top:10px">
    <strong>🔍 Không biết code sai ở đâu?</strong>
    <p class="small" style="margin:6px 0">Đặt ${lang === 'python' ? '<code>trace(i=i, l=l, r=r)</code>' : '<code>trace({ i, l, r })</code>'} vào trong vòng lặp rồi chạy lại —
      app sẽ hiện bảng giá trị các biến qua từng bước, thấy ngay bước nào lệch.</p>
    <button class="btn ghost small" data-insert-trace="1">Chèn trace() vào chỗ con trỏ</button>
  </div>`;
}

/** Thẻ giải thích lỗi tiếng Việt + số dòng + nút nhảy tới dòng đó. */
function errorBlock(message, errorLine, lang, problemId, code) {
  const ex = explainError(message, lang);
  if (ex) store.logError(ex.key, problemId);
  const srcLine = lineOf(code, errorLine);

  // Không nhận ra loại lỗi và cũng không biết dòng nào -> chỉ có thông báo gốc để hiện,
  // mà nơi gọi đã nói "❌ Lỗi khi chạy" rồi. Đừng lặp lại tiêu đề đó lần nữa.
  if (!ex && !errorLine) {
    return `<div class="card err-explain" style="margin-top:10px">
      <pre class="mono small" style="white-space:pre-wrap;margin:0;color:var(--bad)">${esc(message)}</pre>
    </div>`;
  }

  return `<div class="card err-explain" style="margin-top:10px">
    ${ex ? `
      <div class="row"><strong>🧭 Lỗi này nghĩa là gì?</strong></div>
      <p class="small" style="margin:6px 0 10px">${md(ex.title).replace(/^<p>|<\/p>$/g, '')}</p>
      <div class="hint"><strong>Vì sao xảy ra.</strong> ${md(ex.why).replace(/^<p>|<\/p>$/g, '')}</div>
      <div class="hint" style="border-left-color:var(--ok)"><strong>Sửa thế nào.</strong> ${md(ex.fix).replace(/^<p>|<\/p>$/g, '')}</div>`
      : ''}
    ${errorLine ? `
      <div class="err-line">
        <button class="btn ghost tiny" data-goto-line="${errorLine}">Nhảy tới dòng ${errorLine}</button>
        ${srcLine ? `<code>${esc(srcLine)}</code>` : ''}
      </div>` : ''}
    <details class="raw-err"><summary class="muted small">Xem thông báo lỗi gốc</summary>
      <pre class="mono small">${esc(message)}</pre></details>
  </div>`;
}

/** Lỗi ở mức cả lượt chạy (biên dịch / quá thời gian / hệ thống chấm). */
function phaseErrorCard(res, lang, problemId, code) {
  const title = {
    compile: 'Lỗi cú pháp — code chưa chạy được',
    timeout: 'Quá thời gian',
    runtime: 'Lỗi khi chạy',
    harness: 'Lỗi hệ thống chấm',
    worker: 'Không khởi tạo được bộ chạy',
  }[res.phase] || 'Lỗi';

  if (res.phase === 'timeout') {
    const ex = explainTimeout();
    store.logError(ex.key, problemId);
    return `<div class="card err-explain" style="border-color:var(--bad)">
      <div class="row"><strong style="color:var(--bad)">⏱ ${title}</strong></div>
      <p class="small" style="margin:6px 0 10px">${md(ex.title).replace(/^<p>|<\/p>$/g, '')}</p>
      <div class="hint"><strong>Vì sao xảy ra.</strong> ${md(ex.why).replace(/^<p>|<\/p>$/g, '')}</div>
      <div class="hint" style="border-left-color:var(--ok)"><strong>Sửa thế nào.</strong> ${md(ex.fix).replace(/^<p>|<\/p>$/g, '')}</div>
      <details class="raw-err"><summary class="muted small">Xem thông báo gốc</summary>
        <pre class="mono small" style="white-space:pre-wrap">${esc(res.error)}</pre></details>
    </div>`;
  }

  return `<div class="card" style="border-color:var(--bad);padding-bottom:2px">
      <div class="row"><strong style="color:var(--bad)">❌ ${title}</strong></div>
    </div>
    ${errorBlock(res.error, res.errorLine, lang, problemId, code)}`;
}

/** Lấy nội dung dòng thứ n của code (1-based) để hiện cạnh nút "Nhảy tới dòng". */
function lineOf(code, n) {
  if (!n || !code) return null;
  const lines = String(code).split('\n');
  const s = lines[n - 1];
  return s === undefined ? null : s.trim().slice(0, 120);
}

function testCard(r, i, lang, isPy, problemId, code, highlight = false) {
  return `<div class="test ${r.pass ? 'pass' : 'fail'}${highlight ? ' just-ran' : ''}" data-i="${i}">
    <div class="row">
      <span>${r.pass ? '✅' : '❌'}</span>
      <strong>Test ${i + 1}${r.name ? ' — ' + esc(r.name) : ''}</strong>
      <span class="spacer"></span>
      <span class="k">${r.ms} ms</span>
      ${runOneBtn(i)}
    </div>
    ${r.pass ? '' : `
      ${r.args !== null && r.args !== undefined ? `<div class="k">Đầu vào</div><pre>${esc(r.args)}</pre>` : ''}
      ${r.expected !== null && r.expected !== undefined ? `<div class="k">Mong đợi</div><pre>${esc(r.expected)}</pre>` : ''}
      ${r.error ? `<div class="k">Lỗi</div><pre style="color:var(--bad)">${esc(r.error)}</pre>`
        : `<div class="k">Nhận được</div><pre>${esc(r.got)}</pre>`}
    `}
    ${r.pass && highlight && r.got !== null && r.got !== undefined ? `<div class="k">Nhận được</div><pre>${esc(r.got)}</pre>` : ''}
    ${r.error && highlight ? errorBlock(r.error, r.errorLine, lang, problemId, code) : ''}
    ${logsBlock(r.logs, isPy)}
    ${traceBlock(r.trace, lang)}
  </div>`;
}

function testList(res, lang, isPy, problemId, code) {
  if (!res.results?.length) return '';
  return `<div class="tests" style="margin-top:12px">
    ${res.results.map((r, i) => testCard(r, i, lang, isPy, problemId, code)).join('')}
  </div>`;
}

/* ------------------- chẩn đoán tự động khi làm sai ------------------- */
function diagnose(code, res, diagnostics) {
  const notes = [];

  // 1. luật chẩn đoán riêng của từng bài (dựa trên mẫu code)
  for (const d of diagnostics || []) {
    try {
      if (new RegExp(d.test, 'm').test(code)) notes.push(d.message);
    } catch { /* regex hỏng thì bỏ qua */ }
  }

  // 2. chẩn đoán chung từ kết quả chạy
  if (res.phase === 'timeout') {
    notes.push('Kiểm tra: mọi vòng `while` có biến điều kiện thay đổi ở mỗi lần lặp không? Và độ phức tạp của bạn có phù hợp với ràng buộc đề bài không?');
  }
  if (res.ok) {
    const failed = res.results.filter((r) => !r.pass);
    const perfFailed = failed.filter((r) => /Hiệu năng/i.test(r.name || ''));
    if (perfFailed.length && failed.length === perfFailed.length) {
      notes.push('Lời giải của bạn **đúng về mặt logic** — chỉ trượt test hiệu năng. Vấn đề nằm ở độ phức tạp, không phải ở logic. Hãy tìm cách bỏ bớt một vòng lặp.');
    }
    const errs = failed.filter((r) => r.error);
    if (failed.length === 1 && !errs.length) {
      notes.push(`Chỉ **một** test sai (“${esc(failed[0].name || '')}”) — gần như chắc chắn là trường hợp biên. Hãy chạy tay đúng test đó thay vì sửa mò toàn bộ thuật toán (bấm **▶ chạy lại** trên dòng test đó).`);
    }
    if (failed.length && failed.every((r) => /rỗng|một phần tử|0|biên/i.test(r.name || ''))) {
      notes.push('Các test trượt đều là trường hợp biên: mảng rỗng, một phần tử, giá trị 0. Hãy thêm nhánh xử lý riêng ở đầu hàm.');
    }
  }

  if (!notes.length) return '';
  return `<div style="margin-top:10px">
    ${notes.map((n) => `<div class="hint diag">🔍 ${md(n).replace(/^<p>|<\/p>$/g, '')}</div>`).join('')}
  </div>`;
}
