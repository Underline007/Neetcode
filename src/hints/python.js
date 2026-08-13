/**
 * Từ điển cú pháp Python: gom ba phần nội dung lại và chia thành hai nhóm mà trình
 * soạn thảo cần — `globals` (gõ ở đầu dòng) và `members` (gõ sau dấu chấm).
 *
 * Nội dung nằm ở ba tệp theo module của lộ trình, để sửa bài nào tìm đúng chỗ bài đó:
 *   python-core.js  — module 1–3   (nền tảng, điều khiển, cấu trúc dữ liệu)
 *   python-oop.js   — module 4, 5, 11, 14 (lớp, generator/decorator, typing, OOP nâng cao)
 *   python-lib.js   — module 6–10, 12, 13, 15 + cấu trúc cho thuật toán
 */
import CORE from './python-core.js';
import OOP from './python-oop.js';
import LIB from './python-lib.js';

const ALL = [...CORE, ...OOP, ...LIB];

/** Bảng "cú pháp thường dùng" cạnh trình soạn thảo: chọn ra các mẫu hay cần nhất,
 *  gom theo việc người học đang định làm chứ không theo phân loại kỹ thuật. */
const PICK = (labels) => labels.map((l) => ALL.find((i) => i.label === l)).filter(Boolean);

export const PY_SNIPPET_GROUPS = [
  { group: 'Vòng lặp & rẽ nhánh', items: PICK(['for', 'range', 'enumerate', 'zip', 'while', 'toán tử ba ngôi', 'so sánh nối']) },
  { group: 'Cấu trúc dữ liệu', items: PICK(['list', 'dict', 'set', 'defaultdict', 'Counter', 'deque', 'mảng 2 chiều', 'nhân list']) },
  { group: 'Biểu thức Python', items: PICK(['list comprehension', 'dict comprehension', 'generator expression', 'cắt lát', 'gán đồng thời', 'mở gói', 'f-string', 'lambda']) },
  { group: 'Hàm & lớp', items: PICK(['def', 'tham số mặc định', '*args', '**kwargs', 'hàm lồng', 'đệ quy', 'class', '__init__', '@dataclass', '@property']) },
  { group: 'Chuỗi hay dùng', items: PICK(['split', 'join', 'strip', 'replace', 'format', 're.findall', 're.sub']) },
  { group: 'Lỗi & tệp', items: PICK(['try', 'except', 'raise', 'with open', 'json.dumps', 'json.loads']) },
  { group: 'Gỡ lỗi', items: PICK(['print', 'trace', 'assert']) },
];

export const PY_HINTS = {
  indent: '    ',
  indentSize: 4,
  globals: ALL.filter((i) => i.kind !== 'm'),
  members: ALL.filter((i) => i.kind === 'm'),
  snippets: PY_SNIPPET_GROUPS,
};
