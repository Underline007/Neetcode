/**
 * Bộ tô màu cú pháp tối giản cho Python & JavaScript — không phụ thuộc thư viện ngoài,
 * chạy được offline. Dùng chung cho hai nơi:
 *   1. Khối code trong bài giảng / lời giải (qua markdown.js)
 *   2. Lớp phủ tô màu của trình soạn thảo bài tập (qua editor.js)
 *
 * Nguyên tắc: mỗi token KHÔNG bao giờ chứa ký tự xuống dòng, nhờ vậy kết quả có thể cắt
 * theo dòng an toàn (để đánh số dòng, để căn khớp với textarea).
 */

const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escAttr = (s) => escHtml(String(s)).replace(/"/g, '&quot;');

/* ------------------------------ ngôn ngữ ------------------------------ */
const ALIAS = {
  py: 'python', python: 'python', python3: 'python',
  js: 'javascript', javascript: 'javascript', jsx: 'javascript', node: 'javascript', mjs: 'javascript',
};
export const normLang = (l = '') => ALIAS[String(l).trim().toLowerCase()] || '';

const LABEL = { python: 'Python', javascript: 'JavaScript' };

/* ------------------------------ từ khoá ------------------------------ */
const set = (s) => new Set(s.split(/\s+/).filter(Boolean));

const PY_KW = set(`
  def class return if elif else for while break continue pass import from as with
  try except finally raise lambda yield global nonlocal assert del in is not and or
  async await match case
`);
const PY_CONST = set('None True False Ellipsis NotImplemented __name__ __main__');
const PY_BUILTIN = set(`
  print len range enumerate zip map filter sorted reversed sum min max abs round pow divmod
  int float str bool list dict set tuple frozenset bytes bytearray complex
  any all isinstance issubclass type input open iter next callable
  ord chr hex bin oct hash id repr format vars dir getattr setattr hasattr delattr
  super staticmethod classmethod property object slice
  deque defaultdict Counter OrderedDict namedtuple heapq bisect
  heappush heappop heapify heappushpop heapreplace nlargest nsmallest
  bisect_left bisect_right insort insort_left insort_right
  lru_cache cache reduce partial wraps combinations permutations product accumulate groupby chain
  Exception ValueError TypeError KeyError IndexError StopIteration ZeroDivisionError
  RuntimeError AttributeError NotImplementedError RecursionError OverflowError
  Optional List Dict Set Tuple Any Union Callable Iterator Iterable
`);

const JS_KW = set(`
  var let const function return if else for while do break continue switch case default
  new delete typeof instanceof in of class extends super this null undefined true false
  try catch finally throw async await yield static get set import export from as void
`);
const JS_BUILTIN = set(`
  console log warn error Array Object Map Set WeakMap WeakSet JSON Math Number String Boolean
  Promise Symbol BigInt Date RegExp Error TypeError RangeError Infinity NaN globalThis
  parseInt parseFloat isNaN isFinite structuredClone
  push pop shift unshift slice splice concat join reverse sort map filter reduce forEach
  find findIndex includes indexOf lastIndexOf some every flat flatMap fill keys values entries
  has add clone charCodeAt fromCharCode padStart padEnd trim split replace toUpperCase toLowerCase
`);

/* ------------------------------ tiện ích ngữ cảnh ------------------------------ */
function prevNonSpace(src, i) {
  let j = i - 1;
  while (j >= 0 && /\s/.test(src[j])) j--;
  return j >= 0 ? src[j] : '';
}
function nextNonSpace(src, i) {
  let j = i;
  while (j < src.length && /[ \t]/.test(src[j])) j++;
  return j < src.length ? src[j] : '';
}

/** Phân loại một định danh dựa trên bộ từ khoá của ngôn ngữ + ngữ cảnh xung quanh. */
function wordClass(kw, konst, builtin, selfNames) {
  return (text, src, i, state) => {
    const before = prevNonSpace(src, i);
    const after = nextNonSpace(src, i + text.length);
    const wasDef = state.prevKw === 'def' || state.prevKw === 'class' || state.prevKw === 'function';
    state.prevKw = kw.has(text) ? text : null;

    // sau dấu chấm luôn là thuộc tính/phương thức, kể cả khi trùng tên từ khoá (vd map.get)
    if (before === '.' && src[i - 2] !== '.') return 'prop';
    if (wasDef) return 'def';
    if (kw.has(text)) return 'kw';
    if (konst.has(text)) return 'const';
    if (selfNames.has(text)) return 'self';
    if (builtin.has(text)) return 'bi';
    if (after === '(') return 'fn';
    return null;
  };
}

/* ------------------------------ luật token ------------------------------ */
const NUM = /\b(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?[jJnN]?)\b|\.\d+/y;
const WORD = /[A-Za-z_$][\w$]*/y;
const OP = /[+\-*/%=<>!&|^~?:]+/y;
const PUNCT = /[(){}\[\],.;@]/y;
const SPACE = /[ \t]+/y;

const RULES = {
  python: [
    { re: /#[^\n]*/y, cls: 'com' },
    { re: /[rRbBuUfF]{0,2}(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$))/y, cls: 'str' },
    { re: /[rRbBuUfF]{0,2}(?:"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)/y, cls: 'str' },
    { re: /@[A-Za-z_][\w.]*/y, cls: 'dec' },
    { re: NUM, cls: 'num' },
    { re: WORD, cls: wordClass(PY_KW, PY_CONST, PY_BUILTIN, set('self cls')) },
    { re: SPACE, cls: null },
    { re: OP, cls: 'op' },
    { re: PUNCT, cls: 'punc' },
  ],
  javascript: [
    { re: /\/\/[^\n]*/y, cls: 'com' },
    { re: /\/\*[\s\S]*?(?:\*\/|$)/y, cls: 'com' },
    { re: /`(?:\\.|[^`\\])*`?/y, cls: 'str' },
    { re: /"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/y, cls: 'str' },
    { re: NUM, cls: 'num' },
    { re: WORD, cls: wordClass(JS_KW, set('null undefined true false NaN Infinity'), JS_BUILTIN, set('this')) },
    { re: SPACE, cls: null },
    { re: OP, cls: 'op' },
    { re: PUNCT, cls: 'punc' },
  ],
};

/* ------------------------------ bộ tách token ------------------------------ */
function tokenize(src, rules) {
  const out = [];
  const state = { prevKw: null };
  let i = 0;

  while (i < src.length) {
    if (src[i] === '\n') { out.push([null, '\n']); i++; continue; }

    let hit = null;
    for (const rule of rules) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(src);
      if (m && m.index === i && m[0]) { hit = { rule, text: m[0] }; break; }
    }

    if (!hit) { out.push([null, src[i]]); i++; continue; }
    const cls = typeof hit.rule.cls === 'function' ? hit.rule.cls(hit.text, src, i, state) : hit.rule.cls;
    out.push([cls, hit.text]);
    i += hit.text.length;
  }
  return out;
}

/** Tô màu và trả về MẢNG HTML theo từng dòng (mỗi phần tử là nội dung 1 dòng). */
export function highlightLines(code, lang) {
  const rules = RULES[normLang(lang)];
  const src = String(code).replace(/\r/g, '');
  if (!rules) return src.split('\n').map(escHtml);

  const lines = [''];
  for (const [cls, text] of tokenize(src, rules)) {
    const parts = text.split('\n');
    parts.forEach((part, k) => {
      if (k > 0) lines.push('');
      if (!part) return;
      lines[lines.length - 1] += cls ? `<span class="t-${cls}">${escHtml(part)}</span>` : escHtml(part);
    });
  }
  return lines;
}

/** Tô màu, trả về HTML một khối (không có phần khung/nút bấm). */
export function highlightHtml(code, lang) {
  return highlightLines(code, lang).map((l) => `<span class="cl">${l}</span>`).join('');
}

/**
 * Khối code hoàn chỉnh cho nội dung bài giảng: có thanh tiêu đề (tên ngôn ngữ + nút sao
 * chép) và số dòng. Nút sao chép giữ mã nguồn thô trong data-copy nên copy luôn chính xác.
 */
export function codeBlock(code, lang) {
  const norm = normLang(lang);
  const raw = String(code).replace(/\r/g, '').replace(/\n+$/, '');
  const label = LABEL[norm] || (String(lang || '').trim() || 'text');
  const lines = highlightLines(raw, norm);
  const numbered = lines.length > 1;

  return `<div class="code-block" data-lang="${escAttr(norm)}">
    <div class="code-head">
      <span class="code-lang">${escAttr(label)}</span>
      <span class="spacer"></span>
      <button type="button" class="code-copy" data-copy="${escAttr(raw)}">📋 Sao chép</button>
    </div>
    <pre class="hl${numbered ? ' numbered' : ''}"><code>${lines.map((l) => `<span class="cl">${l}</span>`).join('')}</code></pre>
  </div>`;
}
