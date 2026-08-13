import { topicById as jsTopicById } from '../data/index.js';
import { pyTopicById } from '../data/python/index.js';
import { store } from '../store.js';
import { $, $$, esc, inlineMd, toast } from '../ui.js';
import { md } from '../markdown.js';
import { questionHtml } from '../quiz-format.js';
import { pick } from '../lang.js';

const JS_DOMAIN = { topicById: jsTopicById, basePath: '' };
const curLang = () => store.get().lang || 'javascript';

/** Ngôn ngữ dùng để tô màu code trong đề bài: theo đúng bộ câu hỏi đang được hiển thị. */
function quizCodeLang(t) {
  if (pyTopicById.has(t.id)) return 'python'; // module ngôn ngữ Python: đề bài luôn là Python
  return curLang() === 'python' && t.quizPy !== undefined ? 'python' : 'javascript';
}

export function renderQuiz(topicId, domain = JS_DOMAIN) {
  const { topicById, basePath } = domain;
  const t = topicById.get(topicId);
  if (!t) return '<h1>Không tìm thấy quiz</h1>';
  const rec = store.quiz(t.id);
  const quizQs = pick(t, 'quiz', curLang());
  const codeLang = quizCodeLang(t);

  return `
    <div class="row">
      <a class="btn ghost small" href="#${basePath}/topic/${t.id}">← ${t.icon} ${esc(t.name)}</a>
      ${rec.attempts ? `<span class="badge${rec.best >= 75 ? ' ok' : ''}">Điểm cao nhất: ${rec.best}%</span>` : ''}
      <span class="spacer"></span>
      <span class="muted small">${quizQs.length} câu</span>
    </div>

    <h1 style="margin-top:12px">🧠 Kiểm tra hiểu bản chất</h1>
    <p class="sub">Các câu hỏi này không kiểm tra bạn có nhớ code hay không, mà kiểm tra bạn có hiểu <strong>vì sao</strong> thuật toán đúng. Đạt ≥ 75% mới tính là nắm được chủ đề.</p>

    <div id="quiz">
      ${quizQs.map((q, i) => `
        <div class="quiz-q" data-q="${i}">
          <div class="q-text md">${questionHtml(q.q, { lang: codeLang, prefix: `**Câu ${i + 1}.**` })}</div>
          <div class="opts">
            ${q.options.map((o, j) => `<div class="opt" data-i="${j}"><span class="opt-k">${'ABCD'[j]}.</span><span>${inlineMd(o)}</span></div>`).join('')}
          </div>
          <div class="explain"></div>
        </div>`).join('')}
    </div>

    <div class="row" style="margin-top:16px">
      <button class="btn" id="submit-quiz">Nộp bài</button>
      <span class="muted small">Chọn đáp án cho tất cả các câu rồi nộp.</span>
    </div>
    <div id="quiz-result" style="margin-top:14px"></div>
  `;
}

export function mountQuiz(topicId, domain = JS_DOMAIN) {
  const { topicById, basePath } = domain;
  const t = topicById.get(topicId);
  if (!t) return;
  const quizQs = pick(t, 'quiz', curLang());
  const answers = new Array(quizQs.length).fill(null);

  $$('.quiz-q').forEach((qEl) => {
    const qi = Number(qEl.dataset.q);
    $$('.opt', qEl).forEach((opt) => {
      opt.addEventListener('click', () => {
        if (qEl.dataset.done) return;
        $$('.opt', qEl).forEach((o) => o.classList.remove('selected'));
        opt.classList.add('selected');
        answers[qi] = Number(opt.dataset.i);
      });
    });
  });

  $('#submit-quiz').addEventListener('click', () => {
    if (answers.some((a) => a === null)) { toast('Bạn còn câu chưa chọn đáp án.'); return; }

    let correct = 0;
    $$('.quiz-q').forEach((qEl) => {
      const qi = Number(qEl.dataset.q);
      const q = quizQs[qi];
      qEl.dataset.done = '1';
      $$('.opt', qEl).forEach((o, j) => {
        o.classList.remove('selected');
        if (j === q.answer) o.classList.add('correct');
        else if (j === answers[qi]) o.classList.add('wrong');
      });
      if (answers[qi] === q.answer) correct++;
      $('.explain', qEl).innerHTML =
        `<div class="hint md"><strong>${answers[qi] === q.answer ? '✅ Đúng.' : '❌ Chưa đúng.'}</strong> ${md(q.why).replace(/^<p>|<\/p>$/g, '')}</div>`;
    });

    const pct = Math.round((correct / quizQs.length) * 100);
    const rec = store.quiz(t.id);
    rec.attempts++;
    rec.lastAt = Date.now();
    const gained = Math.max(0, pct - rec.best);
    if (pct > rec.best) rec.best = pct;
    if (gained > 0) store.addXp(Math.round(gained * 0.6), { type: 'quiz', ref: t.id });
    else store.touchStreak();
    store.save();

    const verdict = pct >= 90 ? 'Xuất sắc — bạn nắm chắc bản chất chủ đề này.'
      : pct >= 75 ? 'Đạt. Đọc kỹ phần giải thích của câu sai rồi chuyển sang chủ đề tiếp theo.'
        : 'Chưa đạt. Hãy đọc lại bài giảng phần "Ý tưởng cốt lõi" và làm lại quiz — đừng vội sang chủ đề mới.';

    $('#quiz-result').innerHTML = `
      <div class="card" style="border-color:${pct >= 75 ? 'var(--ok)' : 'var(--warn)'}">
        <h3 style="margin-top:0">Kết quả: ${correct}/${quizQs.length} câu đúng (${pct}%)</h3>
        <p style="margin:0">${verdict}</p>
        ${gained > 0 ? `<p class="muted small" style="margin:8px 0 0">+${Math.round(gained * 0.6)} điểm</p>` : ''}
        <div class="row" style="margin-top:12px">
          <a class="btn ghost small" href="#${basePath}/topic/${t.id}">Đọc lại bài giảng</a>
          <button class="btn ghost small" onclick="location.reload()">Làm lại</button>
        </div>
      </div>`;
    $('#quiz-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
