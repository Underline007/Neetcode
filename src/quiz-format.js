/**
 * Định dạng đề bài trắc nghiệm.
 *
 * Nhiều câu hỏi có dạng "một câu dẫn + một đoạn code" trong CÙNG một chuỗi. Nếu đem cả
 * chuỗi đó in đậm rồi đổi \n thành <br>, HTML sẽ gộp khoảng trắng đầu dòng — thụt lề biến
 * mất. Với Python thì thụt lề LÀ cú pháp, nên câu hỏi hoá ra sai nghĩa (ví dụ hàm lồng
 * nhau trông như hai hàm ngang cấp). Ở đây tách đề thành từng khối rồi render:
 *   - khối văn xuôi  -> Markdown ngắn (đậm/nghiêng/`code`)
 *   - khối code      -> khối code có tô màu, giữ thụt lề, có nút sao chép
 *
 * Quy ước viết đề: các khối cách nhau bằng một DÒNG TRỐNG. Khối code được tự nhận dạng;
 * khi muốn chắc chắn (hoặc code trông giống văn xuôi) thì bọc thẳng bằng ``` như bài giảng.
 */

import { md } from './markdown.js';

/* Dấu tiếng Việt: một dòng có dấu gần như chắc chắn là câu văn, không phải code. */
const VI = /[ăâêôơưđàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i;

const KEYWORD = /^(?:def|class|import|from|for|while|if|elif|else|try|except|finally|with|return|yield|raise|assert|pass|break|continue|del|global|nonlocal|lambda|async|await|print|const|let|var|function|new|throw|switch|case|do|console)\b/;
const DECORATOR = /^@[A-Za-z_]/;
const ASSIGN = /^[^=<>!\s]+(?:\s*,\s*[^=<>!\s]+)*\s*(?:\+|-|\*|\/|\/\/|%|\*\*|\||&|\^|>>|<<)?=(?!=)/;
const CALL = /^[\w$.]+\(.*\)[;,]?$/;
const CLOSER = /^[)\]}]+[;,]?$/;
const COMMENT = /^(?:#|\/\/)/;

/** Điểm "code-ness" của một dòng: >0 là dấu hiệu code, <0 là dấu hiệu văn xuôi. */
function lineScore(line) {
  if (/^[ \t]+\S/.test(line)) return 2; // có thụt lề -> dấu hiệu mạnh nhất
  const s = line.trim();
  if (!s) return 0;
  if (COMMENT.test(s)) return 0; // chú thích có thể viết bằng tiếng Việt -> trung tính
  if (/[?!]$/.test(s)) return -3; // câu hỏi
  if (VI.test(s)) return -3;
  if (KEYWORD.test(s) || DECORATOR.test(s) || ASSIGN.test(s) || CALL.test(s) || CLOSER.test(s)) return 1;
  return -1;
}

function looksLikeCode(block) {
  const lines = block.split('\n');
  const scores = lines.map(lineScore);
  return scores.some((s) => s > 0) && scores.reduce((a, b) => a + b, 0) > 0;
}

/**
 * Tách một chuỗi đề thành các khối { code, text } theo dòng trống.
 * Hai khối code liền nhau được nhập lại thành MỘT khối (giữ dòng trống ở giữa): dòng trống
 * bên trong một đoạn code chỉ là cách ngắt đoạn cho dễ đọc, không phải hai đoạn code khác nhau.
 */
export function questionBlocks(text) {
  const raw = String(text)
    .replace(/\r/g, '')
    .trim()
    .split(/\n{2,}/)
    .map((b) => ({ code: looksLikeCode(b), text: b.replace(/\s+$/, '') }))
    .filter((b) => b.text);

  const out = [];
  for (const b of raw) {
    const prev = out[out.length - 1];
    if (b.code && prev?.code) prev.text += `\n\n${b.text}`;
    else out.push(b);
  }
  return out;
}

/**
 * Render đề bài thành HTML.
 * @param {string} text đề bài (văn xuôi + code, cách nhau bằng dòng trống)
 * @param {object} [opts]
 * @param {string} [opts.lang] ngôn ngữ để tô màu code ('python' | 'javascript')
 * @param {string} [opts.prefix] tiền tố Markdown gắn vào đầu câu dẫn, vd '**Câu 1.**'
 */
export function questionHtml(text, { lang = '', prefix = '' } = {}) {
  const src = String(text).replace(/\r/g, '');

  // Đề đã tự bọc ``` thì tôn trọng nguyên bản, chỉ thêm tiền tố.
  if (src.includes('```')) return md(prefix ? `${prefix}\n\n${src}` : src);

  const blocks = questionBlocks(src);
  if (prefix) {
    if (blocks[0] && !blocks[0].code) blocks[0].text = `${prefix} ${blocks[0].text}`;
    else blocks.unshift({ code: false, text: prefix });
  }

  return md(blocks.map((b) => (b.code ? `\`\`\`${lang}\n${b.text}\n\`\`\`` : b.text)).join('\n\n'));
}
