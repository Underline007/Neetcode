/**
 * LỘ TRÌNH PYTHON — MODULE 8: File I/O & Định dạng dữ liệu (JSON/CSV)
 */

export default [
/* ==================================================================== */
{
  id: 'py-file-io',
  name: 'File I/O & Định dạng dữ liệu (JSON/CSV)',
  en: 'File I/O & Data Formats (JSON/CSV)',
  icon: '📄',
  summary: 'Đọc/ghi file đúng cách với `with`, và hai định dạng trao đổi dữ liệu bạn sẽ gặp hàng ngày: JSON (`json`) và CSV (`csv`) — cả hai đều có sẵn trong thư viện chuẩn, không cần cài thêm gì.',
  lesson: `
## 1. Vấn đề gốc

Làm việc với file có một vấn đề chung không liên quan tới ngôn ngữ nào cả: **tài nguyên (file handle) phải
được đóng lại**, dù chương trình chạy xong bình thường hay gặp lỗi giữa chừng. Nếu quên đóng, file có thể
bị khoá, dữ liệu ghi dở có thể không được lưu (do buffer chưa flush), hoặc chương trình rò rỉ tài nguyên khi
mở hàng nghìn file trong vòng lặp lớn.

Python giải quyết vấn đề này bằng **context manager** (\`with\` statement) — cú pháp đảm bảo file luôn được
đóng, kể cả khi có exception xảy ra bên trong khối lệnh. Đây là lý do bạn **luôn luôn** thấy \`with open(...)\`
trong code Python thực tế, gần như không bao giờ thấy gọi \`open()\` rồi tự \`close()\` tay.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript (Node.js) | Python |
|---|---|---|
| Đọc toàn bộ file dạng text | \`fs.readFileSync(path, 'utf8')\` | \`with open(path, encoding='utf-8') as f: text = f.read()\` |
| Ghi file | \`fs.writeFileSync(path, data)\` | \`with open(path, 'w', encoding='utf-8') as f: f.write(data)\` |
| Parse/serialize JSON | \`JSON.parse(s)\` / \`JSON.stringify(obj)\` | \`json.loads(s)\` / \`json.dumps(obj)\` |
| Đọc/ghi CSV | cần thư viện ngoài (\`csv-parse\`, \`papaparse\`...) | có sẵn module \`csv\` trong thư viện chuẩn |
| Đảm bảo đóng tài nguyên dù có lỗi | \`try { ... } finally { fh.close() }\` | \`with open(...) as f: ...\` (ngắn gọn hơn, cùng bản chất) |

## 3. Ý tưởng cốt lõi

**(a) \`with open(path, mode, encoding=...) as f:\`** — các mode quan trọng: \`'r'\` (đọc, mặc định),
\`'w'\` (ghi, **XOÁ SẠCH** nội dung cũ nếu file đã tồn tại), \`'a'\` (append, nối thêm vào cuối, không xoá).
**Luôn chỉ định \`encoding='utf-8'\` tường minh** — nếu không, Python dùng encoding mặc định của hệ điều
hành (trên Windows thường KHÔNG phải UTF-8), gây lỗi \`UnicodeDecodeError\` khó chịu khi file chứa tiếng
Việt có dấu nhưng chạy đúng trên máy bạn (UTF-8 mặc định) rồi lỗi trên máy đồng nghiệp dùng Windows.

**(b) \`json.dumps\`/\`json.loads\` (chuỗi) vs \`json.dump\`/\`json.load\` (file)** — để ý hậu tố "s" (string):
có "s" nghĩa là làm việc với **chuỗi trong bộ nhớ**; không có "s" nghĩa là làm việc **trực tiếp với file
object** (\`json.dump(obj, f)\` ghi thẳng vào \`f\`, không cần \`f.write(json.dumps(obj))\`).

**(c) \`json.dumps(obj, ensure_ascii=False, indent=2)\`** — hai tham số hay dùng: \`ensure_ascii=False\` giữ
nguyên ký tự Unicode (tiếng Việt) thay vì escape thành \`\\uXXXX\`; \`indent=2\` để định dạng dễ đọc (pretty
print) thay vì một dòng dài.

**(d) \`csv.DictReader\`/\`csv.DictWriter\`** — làm việc theo TÊN CỘT (từ dòng header) thay vì chỉ số cột,
tránh lỗi khi thứ tự cột trong file thay đổi. Muốn đọc CSV từ một chuỗi (không phải file thật) — ví dụ khi
viết unit test không cần tạo file thật — dùng \`io.StringIO(text)\` để "giả lập" một file object từ chuỗi.

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài | Nghĩ tới |
|---|---|
| "đọc/ghi file cấu hình" | \`json.load\`/\`json.dump\` với \`with open(...)\` |
| "chuỗi JSON có thể không hợp lệ, đừng để crash" | bắt \`json.JSONDecodeError\` |
| "dữ liệu dạng bảng có tiêu đề cột" | \`csv.DictReader\`/\`csv.DictWriter\` |
| "mỗi dòng là một JSON object riêng" (JSON Lines / \`.jsonl\`) | duyệt từng dòng, \`json.loads\` riêng lẻ mỗi dòng |
| "test hàm đọc CSV/file mà không muốn tạo file thật" | \`io.StringIO(text)\` giả lập file object từ chuỗi |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
import json, csv, io

# (a) Đọc/ghi file text đúng cách
with open("data.txt", encoding="utf-8") as f:
    text = f.read()

with open("out.txt", "w", encoding="utf-8") as f:
    f.write("nội dung mới")   # mode 'w' XOÁ nội dung cũ trước khi ghi

# (b) JSON: string <-> object, và đọc/ghi thẳng file
data = json.loads('{"ten": "An", "tuoi": 20}')      # chuỗi -> dict
s = json.dumps(data, ensure_ascii=False, indent=2)    # dict -> chuỗi đẹp, giữ tiếng Việt

with open("config.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)  # ghi thẳng vào file, không cần .write()

# (c) Bắt lỗi JSON không hợp lệ
try:
    obj = json.loads(text_khong_ro_nguon_goc)
except json.JSONDecodeError:
    obj = None

# (d) CSV theo tên cột, và giả lập file từ chuỗi để test không cần file thật
csv_text = "ten,tuoi\\nAn,20\\nBinh,25"
reader = csv.DictReader(io.StringIO(csv_text))
rows = list(reader)   # [{'ten': 'An', 'tuoi': '20'}, {'ten': 'Binh', 'tuoi': '25'}]
\`\`\`

## 6. Bẫy thường gặp

- **Quên \`encoding='utf-8'\`**: chạy đúng trên máy bạn nhưng lỗi \`UnicodeDecodeError\`/hiển thị sai ký tự
  trên máy khác (đặc biệt Windows) — luôn ghi rõ encoding, đừng dựa vào mặc định của hệ điều hành.
- **Nhầm mode \`'w'\` và \`'a'\`**: mở file có sẵn dữ liệu bằng \`'w'\` sẽ **XOÁ SẠCH** nội dung cũ ngay khi mở
  (trước cả khi bạn kịp ghi gì) — nếu chỉ muốn nối thêm dữ liệu, phải dùng \`'a'\`.
- **\`csv.DictReader\` trả về giá trị dạng CHUỖI, không tự chuyển số**: cột \`"tuoi"\` với giá trị \`"20"\` vẫn
  là chuỗi \`"20"\`, không phải số nguyên \`20\` — phải tự \`int(row["tuoi"])\` nếu cần tính toán.
- **\`json.dumps\` mặc định \`ensure_ascii=True\`**: tiếng Việt bị escape thành \`"\\u00e0"\` thay vì hiển thị
  \`"à"\` — không sai về mặt dữ liệu (JSON vẫn parse lại đúng) nhưng khó đọc khi debug bằng mắt; dùng
  \`ensure_ascii=False\` khi cần file JSON dễ đọc trực tiếp.

## 7. Ứng dụng thực tế

- **File cấu hình ứng dụng** (\`config.json\`): đọc bằng \`json.load\`, validate, rồi mới dùng — luôn bọc
  trong try/except để báo lỗi rõ ràng nếu người dùng chỉnh sai cú pháp JSON.
- **Export báo cáo dạng CSV** để mở bằng Excel/Google Sheets: \`csv.DictWriter\` với header rõ ràng, dễ bảo
  trì hơn nhiều so với tự nối chuỗi bằng dấu phẩy (dễ vỡ khi dữ liệu chứa dấu phẩy/dấu ngoặc kép).
- **Log dạng JSON Lines (\`.jsonl\`)**: mỗi dòng log là một JSON object độc lập — hệ thống lớn ưa chuộng vì
  có thể đọc/xử lý từng dòng một (streaming) mà không cần tải cả file khổng lồ vào bộ nhớ cùng lúc.
`,
  quiz: [
    {
      q: 'Vì sao nên dùng `with open(path) as f:` thay vì gọi `f = open(path)` rồi tự `f.close()` ở cuối?',
      options: [
        '`with` chạy nhanh hơn về mặt hiệu năng đọc/ghi file',
        '`with` đảm bảo file LUÔN được đóng, kể cả khi có exception xảy ra giữa chừng trong khối lệnh — tự gọi `close()` tay sẽ bị bỏ qua nếu code phía trên nó ném lỗi trước khi chạy tới dòng `close()`',
        '`open()` không cho phép gọi `close()` thủ công, bắt buộc phải dùng `with`',
        'Không có khác biệt, chỉ là cách viết ngắn gọn hơn',
      ],
      answer: 1,
      why: '`with` là context manager: nó đảm bảo phương thức đóng file được gọi trong MỌI trường hợp (kể cả khi có exception), tương đương một khối try/finally ẩn bên trong — đây là lý do bản chất, không chỉ là "viết gọn hơn".',
    },
    {
      q: 'Mở file bằng mode `"w"` khi file đó đã có sẵn nội dung sẽ xảy ra điều gì?',
      options: [
        'Nội dung mới sẽ được nối thêm vào cuối nội dung cũ',
        'Nội dung cũ bị XOÁ SẠCH ngay khi mở file, trước cả khi bạn kịp ghi gì mới',
        'Python sẽ báo lỗi vì file đã tồn tại',
        'Không có gì xảy ra cho tới khi bạn gọi `.write()` lần đầu tiên',
      ],
      answer: 1,
      why: 'Mode `"w"` (write) luôn bắt đầu bằng việc xoá sạch nội dung file hiện có. Muốn giữ nội dung cũ và nối thêm, phải dùng mode `"a"` (append).',
    },
    {
      q: '`csv.DictReader` đọc một dòng CSV có cột "tuoi" với giá trị "20". Giá trị này có kiểu dữ liệu gì trong dict trả về?',
      options: [
        '`int` — DictReader tự động nhận diện và chuyển đổi số',
        '`str` — DictReader luôn trả về mọi giá trị dạng chuỗi, phải tự chuyển đổi kiểu (ví dụ `int(row["tuoi"])`) nếu cần tính toán',
        '`float` — mặc định luôn là số thực',
        'Tuỳ vào phiên bản Python, có thể là `int` hoặc `str`',
      ],
      answer: 1,
      why: 'File CSV về bản chất chỉ là văn bản thuần — mọi giá trị `csv.DictReader` trả về đều là chuỗi (`str`), không tự suy luận kiểu dữ liệu. Việc chuyển đổi sang `int`/`float` là trách nhiệm của code gọi, không phải của module `csv`.',
    },
    {
      q: 'Vì sao nên luôn chỉ định tường minh `encoding="utf-8"` khi mở file, thay vì để Python dùng encoding mặc định?',
      options: [
        'Vì `encoding="utf-8"` giúp file đọc nhanh hơn đáng kể',
        'Vì encoding mặc định phụ thuộc vào HỆ ĐIỀU HÀNH đang chạy chương trình (ví dụ có thể khác nhau giữa Windows và Linux) — code có thể chạy đúng trên máy bạn nhưng lỗi `UnicodeDecodeError` trên máy khác nếu file chứa ký tự có dấu',
        'Python bắt buộc phải chỉ định encoding, nếu không sẽ báo lỗi cú pháp ngay lập tức',
        'Không có lý do kỹ thuật, chỉ là quy ước code sạch',
      ],
      answer: 1,
      why: 'Không chỉ định `encoding` khiến Python dùng "locale mặc định" của hệ điều hành đang chạy — trên nhiều bản Windows đây KHÔNG phải UTF-8, dẫn tới lỗi khi đọc file chứa tiếng Việt có dấu dù code chạy hoàn toàn bình thường trên máy Linux/Mac của người viết.',
    },
    {
      q: '`json.dumps(obj)` và `json.dump(obj, f)` khác nhau ở điểm nào?',
      options: [
        'Không khác nhau, chỉ là hai cách viết tương đương',
        '`json.dumps` (có "s") trả về một CHUỖI trong bộ nhớ; `json.dump` (không có "s") ghi trực tiếp vào một file object `f`, không cần tự gọi thêm `f.write(...)`',
        '`json.dump` chỉ hoạt động với số, `json.dumps` hoạt động với mọi kiểu dữ liệu',
        '`json.dumps` nhanh hơn `json.dump` vì không cần I/O',
      ],
      answer: 1,
      why: 'Quy ước đặt tên trong module `json`: hậu tố "s" (string) nghĩa là hàm đó làm việc với chuỗi trong bộ nhớ. `dumps`/`loads` thao tác với `str`; `dump`/`load` thao tác trực tiếp với file object, tự xử lý việc ghi/đọc.',
    },
    {
      q: 'Kết quả của `json.loads(json.dumps({1: "a", "b": (2, 3)}))` là gì?',
      options: [
        "{1: 'a', 'b': (2, 3)} — nguyên vẹn như ban đầu",
        "{'1': 'a', 'b': [2, 3]} — khoá số thành chuỗi, tuple thành list",
        'TypeError vì JSON không hỗ trợ khoá số',
        "{1: 'a', 'b': [2, 3]}",
      ],
      answer: 1,
      why: 'JSON là một định dạng **nghèo hơn** Python: khoá của object bắt buộc phải là chuỗi, và JSON không có khái niệm tuple. Vì vậy `json.dumps` âm thầm chuyển khoá `1` thành `"1"` và tuple thành mảng — sau khi round-trip, kiểu dữ liệu đã đổi mà không có cảnh báo nào. Hệ quả thực tế: đừng bao giờ giả định `json.loads(json.dumps(x)) == x`. (Còn `set` thì thẳng thừng hơn: `TypeError: Object of type set is not JSON serializable`.)',
    },
    {
      q: 'Trên Windows, ghi file CSV bằng `csv.writer` với `open(path, "w", encoding="utf-8")` (không có `newline=""`) sẽ bị gì?',
      options: [
        'File bị lỗi mã hoá tiếng Việt',
        'Xuất hiện một dòng trống xen giữa mỗi dòng dữ liệu',
        'Không ghi được gì cả',
        'Không có vấn đề gì, `newline=""` chỉ là tuỳ chọn cho đẹp',
      ],
      answer: 1,
      why: 'Hai tầng cùng thêm ký tự xuống dòng: `csv.writer` tự ghi `\\r\\n` ở cuối mỗi dòng, rồi chế độ text mode của Python lại dịch `\\n` thành `\\r\\n` một lần nữa → thành `\\r\\r\\n`, và Excel hiển thị thành dòng trống xen kẽ. `newline=""` tắt tầng dịch của Python, để module `csv` tự quản lý — đây là lý do tài liệu chính thức yêu cầu LUÔN dùng nó khi mở file cho `csv`, cả khi đọc lẫn khi ghi.',
    },
    {
      q: 'Đoạn code sau: biến `b` chứa gì?\n\nwith open("data.txt") as f:\n    a = f.readlines()\n    b = f.readlines()',
      options: ['Cùng nội dung với a', 'Danh sách rỗng []', 'None', 'ValueError: I/O operation on closed file'],
      answer: 1,
      why: 'File object là một **iterator có con trỏ vị trí**: lần `readlines()` đầu đọc tới cuối file, con trỏ nằm ở EOF, nên lần thứ hai không còn gì để đọc và trả về `[]` — im lặng, không báo lỗi. Đây đúng là bẫy "generator dùng một lần" ở phiên bản file. Muốn đọc lại phải tua con trỏ về đầu bằng `f.seek(0)`, hoặc giữ kết quả trong biến để dùng lại.',
    },
    {
      q: 'Khi duyệt file bằng `for line in f:`, vì sao nên dùng `line.rstrip("\\n")` thay vì `line.strip()`?',
      options: [
        'Vì `strip()` chậm hơn đáng kể',
        'Vì `strip()` bỏ luôn khoảng trắng ở hai đầu — làm mất dữ liệu có ý nghĩa như thụt đầu dòng hoặc giá trị cột có khoảng trắng',
        'Vì `strip()` không bỏ được ký tự xuống dòng',
        'Vì `rstrip` là cách duy nhất bỏ được `\\r\\n` của Windows',
      ],
      answer: 1,
      why: 'Mỗi dòng lấy từ file đều còn ký tự `\\n` ở cuối, nên phải cắt. Nhưng `strip()` cắt **mọi** khoảng trắng ở cả hai đầu: file YAML/Python mất thụt đầu dòng, cột CSV `" Nguyen Van A "` mất khoảng trắng cố ý, dòng chỉ gồm dấu tab trở thành rỗng. `rstrip("\\n")` nêu rõ đúng thứ cần bỏ. (Với file Windows đọc ở text mode, `\\r\\n` đã được Python tự dịch về `\\n`; chỉ khi mở ở chế độ nhị phân bạn mới cần lo tới `\\r`.)',
    },
  ],
  problems: [
    {
      id: 'py-safe-json-loads',
      title: 'Parse JSON an toàn',
      en: 'Safe JSON Parse',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'safe_json_loads',
      lang: 'python',
      statement: `
Viết hàm \`safe_json_loads(text)\` trả về dữ liệu đã parse từ chuỗi JSON \`text\`. Nếu \`text\` **không phải
JSON hợp lệ**, trả về \`None\` thay vì để chương trình crash.

**Ví dụ**
- \`safe_json_loads('{"ten": "An", "tuoi": 20}')\` → \`{"ten": "An", "tuoi": 20}\`
- \`safe_json_loads('[1, 2, 3]')\` → \`[1, 2, 3]\`
- \`safe_json_loads('không phải json')\` → \`None\`
- \`safe_json_loads('')\` → \`None\`
`,
      starter: `import json\n\ndef safe_json_loads(text):\n    # Tra ve du lieu da parse, hoac None neu text khong phai JSON hop le\n    \n`,
      tests: [
        { args: ['{"ten": "An", "tuoi": 20}'], expected: { ten: 'An', tuoi: 20 }, name: 'Object JSON hợp lệ' },
        { args: ['[1, 2, 3]'], expected: [1, 2, 3], name: 'Array JSON hợp lệ' },
        { args: ['không phải json'], expected: null, name: 'Chuỗi không phải JSON -> None' },
        { args: [''], expected: null, name: 'Chuỗi rỗng -> None' },
        { args: ['42'], expected: 42, name: 'JSON hợp lệ chỉ là một số' },
        { args: ['{"thieu_dau_ngoac": '], expected: null, name: 'JSON viết dở, thiếu ký tự đóng -> None' },
      ],
      hints: [
        'Bọc `json.loads(text)` trong `try`. Lỗi cần bắt là `json.JSONDecodeError` (kế thừa từ `ValueError`, nên bắt `ValueError` cũng hoạt động, nhưng bắt đúng `json.JSONDecodeError` rõ ràng hơn về ý định).',
        'Nếu parse thành công, trả về kết quả luôn. Nếu lỗi, trả về `None` trong khối `except`.',
        'Đây lại là một ví dụ EAFP: cứ thử `json.loads` luôn, không cần tự viết logic kiểm tra "chuỗi này có giống JSON không" trước khi parse.',
      ],
      diagnostics: [
        { test: 'except\\s+Exception', message: 'Bắt `except Exception` quá rộng — hãy bắt đúng `json.JSONDecodeError` (hoặc `ValueError`) để không vô tình nuốt các lỗi lập trình khác không liên quan tới việc parse JSON.' },
      ],
      approach: `
Áp dụng lại đúng mẫu EAFP đã học ở module Ngoại lệ: cứ parse, lỗi thì bắt.

\`\`\`python
import json

def safe_json_loads(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None
\`\`\`

**Vì sao \`json.JSONDecodeError\` chứ không phải \`ValueError\` chung chung?** Về mặt kỹ thuật cả hai đều
hoạt động (\`JSONDecodeError\` kế thừa từ \`ValueError\`), nhưng bắt đúng loại cụ thể giúp code TỰ GIẢI THÍCH
Ý ĐỊNH: người đọc code biết ngay đây là lỗi "JSON không hợp lệ", không phải một \`ValueError\` bất kỳ nào
khác có thể xảy ra do nhầm lẫn logic ở chỗ khác.
`,
      solution: `import json

def safe_json_loads(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None`,
      complexity: {
        question: 'Độ phức tạp thời gian của `safe_json_loads` theo độ dài n của text?',
        options: ['O(1)', 'O(n) — bộ parse JSON phải quét qua toàn bộ chuỗi input một lượt', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: 'Parse JSON về bản chất là quét tuyến tính qua chuỗi ký tự đầu vào để xây dựng cấu trúc dữ liệu tương ứng, nên chi phí tỉ lệ thuận với độ dài chuỗi.',
      },
      realWorld: 'Đọc response từ API bên thứ ba (có thể trả về lỗi HTML thay vì JSON khi server sập), đọc file cấu hình do người dùng tự chỉnh sửa (dễ gõ sai cú pháp) — luôn parse an toàn thay vì để một request/file lỗi làm sập cả tiến trình.',
    },
    {
      id: 'py-csv-to-dicts',
      title: 'Chuyển văn bản CSV thành list of dict',
      en: 'CSV Text to List of Dicts',
      difficulty: 'Medium',
      targetMinutes: 10,
      entry: 'csv_to_dicts',
      lang: 'python',
      statement: `
Viết hàm \`csv_to_dicts(csv_text)\` nhận nội dung một file CSV dưới dạng **chuỗi** (dòng đầu là header), trả
về **list các dict**, mỗi dict ứng với một dòng dữ liệu, khoá là tên cột.

**Ví dụ**
- \`csv_to_dicts("ten,tuoi\\nAn,20\\nBinh,25")\`
  → \`[{"ten": "An", "tuoi": "20"}, {"ten": "Binh", "tuoi": "25"}]\`

> Chú ý: giá trị trong dict là **chuỗi**, không tự động chuyển thành số — đây là hành vi mặc định của
> \`csv.DictReader\`, không phải lỗi.
`,
      starter: `import csv\nimport io\n\ndef csv_to_dicts(csv_text):\n    # Tra ve list cac dict, dung csv.DictReader tren io.StringIO(csv_text)\n    \n`,
      tests: [
        { args: ['ten,tuoi\nAn,20\nBinh,25'], expected: [{ ten: 'An', tuoi: '20' }, { ten: 'Binh', tuoi: '25' }], name: 'CSV cơ bản 2 dòng' },
        { args: ['ten,tuoi\n'], expected: [], name: 'Chỉ có header, không có dòng dữ liệu' },
        { args: ['a,b,c\n1,2,3'], expected: [{ a: '1', b: '2', c: '3' }], name: '3 cột, 1 dòng dữ liệu' },
        { args: ['ten,thanh_pho\nAn,"Hà Nội"\nBinh,"Hồ Chí Minh"'], expected: [{ ten: 'An', thanh_pho: 'Hà Nội' }, { ten: 'Binh', thanh_pho: 'Hồ Chí Minh' }], name: 'Giá trị có dấu cách, đặt trong ngoặc kép' },
      ],
      hints: [
        'Dùng `io.StringIO(csv_text)` để biến chuỗi thành một "file object giả" — `csv.DictReader` cần một đối tượng có thể đọc từng dòng, giống file thật, và `StringIO` cung cấp đúng interface đó từ một chuỗi có sẵn trong bộ nhớ.',
        '`csv.DictReader(io.StringIO(csv_text))` tự động dùng DÒNG ĐẦU TIÊN làm tên cột (header), các dòng sau trở thành dict.',
        'Kết quả của `csv.DictReader` là một iterator — bọc bằng `list(...)` để lấy ra list các dict cụ thể.',
      ],
      diagnostics: [
        { test: '\\.split\\s*\\(\\s*[\'"],[\'"]\\s*\\)', message: 'Tự viết `.split(",")` để tách CSV thủ công sẽ SAI khi giá trị chứa dấu phẩy bên trong dấu ngoặc kép (ví dụ "Hà Nội, Việt Nam"). Hãy dùng module `csv` chuẩn của Python — nó xử lý đúng các trường hợp phức tạp này.' },
      ],
      approach: `
Bài này giới thiệu một kỹ thuật quan trọng: **\`io.StringIO\` giả lập file object từ chuỗi trong bộ nhớ** —
rất hữu ích khi viết unit test cho hàm xử lý file mà không muốn tạo file thật trên đĩa.

\`\`\`python
import csv
import io

def csv_to_dicts(csv_text):
    reader = csv.DictReader(io.StringIO(csv_text))
    return list(reader)
\`\`\`

**Vì sao không tự viết \`csv_text.split("\\n")\` rồi \`line.split(",")\`?** Vì CSV thật có nhiều trường hợp
phức tạp mà cách tách thủ công này xử lý SAI: giá trị chứa dấu phẩy bên trong cặp dấu ngoặc kép (ví dụ
\`"Hà Nội, Việt Nam"\` là MỘT giá trị, không phải hai), giá trị chứa xuống dòng bên trong ngoặc kép, hay dấu
ngoặc kép cần escape thành \`""\`. Module \`csv\` chuẩn của Python đã xử lý đúng toàn bộ các trường hợp này
theo chuẩn RFC 4180 — tự viết lại bằng \`split\` gần như luôn có bug tiềm ẩn.
`,
      solution: `import csv
import io

def csv_to_dicts(csv_text):
    reader = csv.DictReader(io.StringIO(csv_text))
    return list(reader)`,
      complexity: {
        question: 'Độ phức tạp thời gian của `csv_to_dicts` theo tổng số ký tự n trong csv_text?',
        options: ['O(1)', 'O(n) — mỗi ký tự trong văn bản CSV được quét qua đúng một số lần cố định để tách cột/dòng', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: 'Bộ phân tích CSV quét tuyến tính qua toàn bộ văn bản để tách các trường theo dấu phẩy/dòng/dấu ngoặc kép, chi phí tỉ lệ thuận với độ dài văn bản đầu vào.',
      },
      realWorld: 'Import dữ liệu từ file Excel/Google Sheets xuất ra CSV (danh sách khách hàng, đơn hàng, sản phẩm) vào hệ thống — dùng `DictReader` để code không phụ thuộc vào THỨ TỰ cột trong file, chỉ cần tên cột đúng.',
    },
    {
      id: 'py-count-active-jsonl',
      title: 'Đếm bản ghi "active" trong JSON Lines',
      en: 'Count Active Records in JSON Lines',
      difficulty: 'Medium',
      targetMinutes: 10,
      entry: 'count_active',
      lang: 'python',
      statement: `
Viết hàm \`count_active(jsonl_text)\` nhận nội dung dạng **JSON Lines** (mỗi dòng là một JSON object độc
lập), đếm số dòng có \`"status": "active"\`. **Bỏ qua** (không đếm, không crash) những dòng không phải JSON
hợp lệ hoặc dòng rỗng.

**Ví dụ**
\`\`\`
{"id": 1, "status": "active"}
{"id": 2, "status": "inactive"}
{"id": 3, "status": "active"}
dòng lỗi không phải json
{"id": 4, "status": "active"}
\`\`\`
→ \`count_active(...)\` trả về \`3\`
`,
      starter: `import json\n\ndef count_active(jsonl_text):\n    # Dem so dong co "status": "active", bo qua dong loi/rong\n    \n`,
      tests: [
        {
          args: ['{"id": 1, "status": "active"}\n{"id": 2, "status": "inactive"}\n{"id": 3, "status": "active"}\ndòng lỗi không phải json\n{"id": 4, "status": "active"}'],
          expected: 3,
          name: 'Ví dụ cơ bản, có 1 dòng lỗi bị bỏ qua',
        },
        { args: [''], expected: 0, name: 'Chuỗi rỗng -> 0' },
        { args: ['{"status": "active"}'], expected: 1, name: 'Chỉ 1 dòng, active' },
        { args: ['{"status": "inactive"}\n{"status": "inactive"}'], expected: 0, name: 'Không có dòng nào active' },
        {
          args: ['{"status": "active"}\n\n{"status": "active"}'],
          expected: 2,
          name: 'Có dòng rỗng ở giữa, bỏ qua không tính lỗi',
        },
      ],
      hints: [
        'Tách `jsonl_text` thành từng dòng bằng `.splitlines()` (khác `.split("\\n")` ở chỗ xử lý gọn các ký tự xuống dòng khác nhau, và không tạo phần tử rỗng thừa ở cuối).',
        'Với mỗi dòng: nếu dòng rỗng (sau khi `.strip()`) thì bỏ qua ngay. Nếu không, thử `json.loads(dong)` trong `try`/`except json.JSONDecodeError` — lỗi thì bỏ qua (giống mẫu "bỏ qua phần tử lỗi" đã học ở module Ngoại lệ).',
        'Sau khi parse thành công một dòng thành dict, kiểm tra `dict.get("status") == "active"` (dùng `.get` để không lỗi nếu dòng JSON đó thiếu hẳn field "status").',
      ],
      diagnostics: [
        { test: '\\.split\\s*\\(\\s*[\'"]\\\\n[\'"]\\s*\\)', message: '`.split("\\n")` có thể tạo ra phần tử rỗng thừa ở cuối chuỗi (nếu văn bản kết thúc bằng dòng trống) — cân nhắc dùng `.splitlines()`, xử lý các trường hợp xuống dòng gọn gàng hơn.' },
      ],
      approach: `
Bài này kết hợp 3 kỹ năng đã học: tách văn bản thành dòng, parse JSON từng dòng, và **bỏ qua dòng lỗi** thay
vì để cả hàm crash.

\`\`\`python
import json

def count_active(jsonl_text):
    count = 0
    for line in jsonl_text.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        if record.get("status") == "active":
            count += 1
    return count
\`\`\`

**Vì sao xử lý JSON Lines từng dòng một, thay vì \`json.loads\` cả khối văn bản một lần?** Vì JSON Lines
KHÔNG PHẢI một JSON hợp lệ duy nhất (không có \`[...]\` bao ngoài, không có dấu phẩy giữa các object) — mỗi
dòng là MỘT JSON object hoàn toàn độc lập. Định dạng này được thiết kế có chủ đích để có thể xử lý
**streaming**: đọc và xử lý từng dòng log một, không cần tải cả file khổng lồ vào bộ nhớ cùng lúc, và một
dòng bị lỗi/ghi dở không làm hỏng khả năng đọc các dòng còn lại.
`,
      solution: `import json

def count_active(jsonl_text):
    count = 0
    for line in jsonl_text.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        if record.get("status") == "active":
            count += 1
    return count`,
      complexity: {
        question: 'Độ phức tạp thời gian của `count_active` theo tổng độ dài n của jsonl_text?',
        options: ['O(1)', 'O(n) — mỗi ký tự trong văn bản chỉ được xử lý một số lần cố định (tách dòng + parse JSON mỗi dòng)', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: 'Tách dòng và parse JSON mỗi dòng đều là các thao tác tuyến tính; tổng công việc trên toàn bộ văn bản tỉ lệ thuận với tổng số ký tự, không phụ thuộc theo kiểu bậc hai.',
      },
      realWorld: 'Phân tích log server dạng JSON Lines (định dạng phổ biến của Docker, nhiều hệ thống logging hiện đại): đếm số request lỗi, số user active, mà không cần nạp toàn bộ file log khổng lồ (có thể hàng GB) vào bộ nhớ cùng lúc — xử lý từng dòng một cách "streaming".',
    },
    {
      id: 'py-parse-config-text',
      title: 'Phân tích file cấu hình key=value',
      en: 'Parse key=value Config',
      difficulty: 'Medium',
      targetMinutes: 14,
      entry: 'parse_config',
      lang: 'python',
      statement: `
Viết hàm \`parse_config(text)\` phân tích nội dung một file cấu hình dạng \`key=value\` và trả về \`dict\`.

**Quy tắc**
- Bỏ qua dòng trống và dòng chỉ có khoảng trắng.
- Bỏ qua dòng **chú thích**: dòng mà ký tự khác khoảng trắng đầu tiên là \`#\`.
- Tách theo dấu \`=\` **đầu tiên** — phần sau có thể chứa thêm dấu \`=\`.
- Cắt khoảng trắng thừa ở hai đầu của cả khoá lẫn giá trị.
- Dòng không chứa dấu \`=\` nào thì bỏ qua.
- Khoá trùng nhau: dòng **sau ghi đè** dòng trước.

**Ví dụ**
\`\`\`
# cau hinh
host = localhost
url=http://api.local?a=1&b=2
\`\`\`
→ \`{"host": "localhost", "url": "http://api.local?a=1&b=2"}\`
`,
      starter: `def parse_config(text):\n    # Trả về dict các cặp key=value\n    \n`,
      checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
      tests: [
        { args: ['a=1\nb=2'], expected: { a: '1', b: '2' }, name: 'Hai cặp cơ bản' },
        { args: ['# chu thich\nkey = value '], expected: { key: 'value' }, name: 'Bỏ chú thích, cắt khoảng trắng' },
        { args: ['url=http://api.local?a=1&b=2'], expected: { url: 'http://api.local?a=1&b=2' }, name: 'Giá trị chứa thêm dấu = — bẫy chính' },
        { args: [''], expected: {}, name: 'Chuỗi rỗng' },
        { args: ['  \n\nkhong_co_dau_bang\nk=v'], expected: { k: 'v' }, name: 'Dòng trống và dòng không hợp lệ' },
        { args: ['a=1\na=2'], expected: { a: '2' }, name: 'Khoá trùng — dòng sau thắng' },
        { args: ['empty='], expected: { empty: '' }, name: 'Giá trị rỗng vẫn là cặp hợp lệ' },
        { args: ['   # thut dau dong roi moi chu thich\nx=1'], expected: { x: '1' }, name: 'Chú thích có thụt đầu dòng' },
        { args: ['name = Nguyen Van A'], expected: { name: 'Nguyen Van A' }, name: 'Giá trị có khoảng trắng bên trong' },
      ],
      hints: [
        'Tách văn bản thành từng dòng bằng `text.splitlines()` — nó xử lý sẵn cả `\\n` lẫn `\\r\\n` và không tạo phần tử rỗng thừa ở cuối như `text.split("\\n")`.',
        'Với mỗi dòng: `line = line.strip()`; nếu `not line` hoặc `line.startswith("#")` thì `continue`. Việc `strip()` trước khi kiểm tra `#` giải quyết luôn trường hợp chú thích có thụt đầu dòng.',
        'Bẫy quan trọng nhất: `line.split("=")` cắt tại MỌI dấu `=`, làm hỏng URL và chuỗi kết nối. Hãy giới hạn số lần cắt: `key, value = line.split("=", 1)` — số 1 nghĩa là "chỉ cắt một lần, ở dấu đầu tiên".',
      ],
      diagnostics: [
        { test: '\\.split\\s*\\(\\s*["\']=["\']\\s*\\)', message: '`split("=")` cắt tại MỌI dấu bằng: giá trị `http://api.local?a=1&b=2` sẽ bị vỡ thành nhiều mảnh (và lệnh gán hai biến sẽ raise `ValueError: too many values to unpack`). Thêm giới hạn: `split("=", 1)`.' },
        { test: '\\.split\\s*\\(\\s*["\']\\\\n["\']', message: '`text.split("\\n")` không xử lý được dấu xuống dòng kiểu Windows (`\\r\\n`) — bạn sẽ nhận các giá trị dính ký tự `\\r` ở cuối. Dùng `text.splitlines()`.' },
        { test: '\\bin\\s+line\\b(?![\\s\\S]*split)', message: 'Kiểm tra `"=" in line` là đúng hướng, nhưng nhớ rằng sau đó vẫn phải cắt tại dấu `=` ĐẦU TIÊN, không phải mọi dấu `=`.' },
      ],
      approach: `
Đây là bài "parser mini" — dạng việc bạn sẽ gặp liên tục khi đọc log, cấu hình, hay dữ liệu thô. Điểm
đáng học không phải cú pháp mà là **thứ tự các quyết định**.

\`\`\`python
def parse_config(text):
    config = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        config[key.strip()] = value.strip()
    return config
\`\`\`

**Bốn quyết định, mỗi cái là một cái bẫy đã được cài trong bộ test:**

1. **\`splitlines()\` thay vì \`split("\\n")\`.** \`splitlines()\` hiểu cả \`\\n\`, \`\\r\\n\`, \`\\r\` và không sinh
   phần tử rỗng thừa ở cuối. Dùng \`split("\\n")\` trên file tạo bởi Windows sẽ để lại \`\\r\` dính vào cuối
   mọi giá trị — bug kinh điển "so sánh chuỗi thấy giống hệt mà vẫn không bằng nhau".

2. **\`strip()\` trước khi kiểm tra \`#\`.** Nhờ vậy chú thích có thụt đầu dòng vẫn được nhận diện, mà không
   cần thêm nhánh riêng.

3. **\`split("=", 1)\` — tham số \`maxsplit\`.** Đây là khác biệt giữa parser dùng được và parser hỏng ngay
   khi gặp URL, chuỗi kết nối database, hay giá trị mã hoá base64 (thường kết thúc bằng \`=\`).

4. **Bỏ qua thay vì raise.** Bài này chọn "dòng lạ thì bỏ qua" — phù hợp với file cấu hình do người viết
   tay. Một hệ thống nghiêm ngặt hơn có thể muốn báo lỗi kèm **số dòng**; khi đó hãy dùng
   \`for lineno, line in enumerate(text.splitlines(), 1)\` để thông báo lỗi có ích cho người dùng.
`,
      solution: `def parse_config(text):
    config = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        config[key.strip()] = value.strip()
    return config`,
      complexity: {
        question: 'Độ phức tạp thời gian của parse_config theo tổng số ký tự n của text?',
        options: [
          'O(n) — mỗi ký tự được duyệt qua một số lần hằng định (tách dòng, strip, split)',
          'O(n²) vì mỗi lần chèn vào dict phải kiểm tra khoá đã tồn tại',
          'O(n log n) do phải sắp xếp các khoá',
          'O(số dòng)',
        ],
        answer: 0,
        why: 'Các thao tác `splitlines`, `strip`, `split` đều tuyến tính theo độ dài phần chúng xử lý, và mỗi ký tự chỉ thuộc đúng một dòng → tổng cộng O(n). Chèn vào dict là O(1) trung bình. Bộ nhớ cũng O(n) vì `splitlines()` vật chất hoá toàn bộ danh sách dòng — với file rất lớn, nên đọc trực tiếp `for line in f` để giữ bộ nhớ O(1).',
      },
      realWorld: 'Đọc file `.env`, `.ini`, `requirements.txt`, `/proc/meminfo` trên Linux, hay bất kỳ định dạng "một dòng một cặp" nào. Chi tiết `maxsplit=1` là thứ phân biệt một hàm chạy được với dữ liệu mẫu và một hàm sống sót với dữ liệu thật — nơi giá trị luôn chứa đúng ký tự mà bạn dùng làm dấu phân tách.',
    },
    {
      id: 'py-canonical-json',
      title: 'JSON chuẩn hoá để so sánh và ký',
      en: 'Canonical JSON Dump',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'canonical_json',
      lang: 'python',
      statement: `
Viết hàm \`canonical_json(obj)\` chuyển một object Python thành chuỗi JSON **chuẩn hoá** — cùng dữ liệu thì
luôn cho ra **đúng một chuỗi duy nhất**, không phụ thuộc thứ tự khoá lúc tạo.

Ba yêu cầu:
1. Khoá của mọi object được **sắp xếp theo thứ tự chữ cái** (kể cả object lồng nhau).
2. **Không có khoảng trắng thừa**: dùng \`,\` và \`:\` sát nhau.
3. **Giữ nguyên ký tự Unicode** (tiếng Việt hiển thị được, không bị escape thành \`\\uXXXX\`).

**Ví dụ**
- \`{"b": 1, "a": 2}\` → \`'{"a":2,"b":1}'\`
- \`{"ten": "Hà Nội"}\` → \`'{"ten":"Hà Nội"}'\`
- \`{"z": {"y": 1, "x": 2}}\` → \`'{"z":{"x":2,"y":1}}'\`
`,
      starter: `import json\n\n\ndef canonical_json(obj):\n    # Chuỗi JSON chuẩn hoá: khoá đã sắp xếp, không khoảng trắng, giữ Unicode\n    \n`,
      tests: [
        { args: [{ b: 1, a: 2 }], expected: '{"a":2,"b":1}', name: 'Sắp xếp khoá' },
        { args: [{ ten: 'Hà Nội' }], expected: '{"ten":"Hà Nội"}', name: 'Giữ nguyên tiếng Việt' },
        { args: [{}], expected: '{}', name: 'Object rỗng' },
        { args: [{ a: [1, 2] }], expected: '{"a":[1,2]}', name: 'Mảng bên trong — không khoảng trắng' },
        { args: [{ z: { y: 1, x: 2 } }], expected: '{"z":{"x":2,"y":1}}', name: 'Sắp xếp cả ở tầng lồng nhau' },
        { args: [[1, 'a']], expected: '[1,"a"]', name: 'Đầu vào là mảng' },
        { args: [{ a: null, b: true }], expected: '{"a":null,"b":true}', name: 'None và True thành null và true' },
        { args: [{ m: 1, a: 2, z: 3 }], expected: '{"a":2,"m":1,"z":3}', name: 'Ba khoá xáo trộn' },
      ],
      hints: [
        'Toàn bộ bài nằm ở việc dùng đúng các tham số của `json.dumps` — không cần tự viết vòng lặp nào.',
        '`sort_keys=True` sắp xếp khoá (và làm việc đó **đệ quy** cho mọi tầng). `ensure_ascii=False` giữ nguyên ký tự Unicode thay vì escape.',
        'Mặc định `json.dumps` chèn khoảng trắng: `{"a": 1, "b": 2}`. Tham số `separators=(",", ":")` loại bỏ chúng. Kết hợp cả ba: `json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(",", ":"))`.',
      ],
      diagnostics: [
        { test: 'str\\s*\\(\\s*obj\\s*\\)|repr\\s*\\(', message: '`str(obj)` / `repr(obj)` KHÔNG phải JSON: chúng dùng nháy đơn, và ghi `True`/`None` thay vì `true`/`null`. Phải dùng `json.dumps`.' },
        { test: '^(?![\\s\\S]*sort_keys)[\\s\\S]*json\\.dumps', message: 'Thiếu `sort_keys=True`. Không có nó, hai dict cùng nội dung nhưng khác thứ tự chèn sẽ cho hai chuỗi khác nhau — đúng thứ mà bài này muốn loại bỏ.' },
        { test: '^(?![\\s\\S]*separators)[\\s\\S]*json\\.dumps', message: 'Thiếu `separators=(",", ":")`. Mặc định `json.dumps` chèn một khoảng trắng sau mỗi dấu `,` và `:`, nên kết quả sẽ là `{"a": 2, "b": 1}` chứ không phải `{"a":2,"b":1}`.' },
        { test: 'ensure_ascii\\s*=\\s*True', message: '`ensure_ascii=True` (mặc định) escape mọi ký tự ngoài ASCII: `"Hà Nội"` thành `"H\\\\u00e0 N\\\\u1ed9i"`. Đặt `ensure_ascii=False` để giữ nguyên tiếng Việt.' },
      ],
      approach: `
"Chuẩn hoá" (canonicalization) là bước bắt buộc mỗi khi bạn cần **so sánh, băm, hoặc ký** dữ liệu có cấu
trúc. Vấn đề gốc: cùng một object có vô số cách biểu diễn thành chuỗi JSON hợp lệ.

\`\`\`python
json.dumps({"a": 1, "b": 2})   # '{"a": 1, "b": 2}'
json.dumps({"b": 2, "a": 1})   # '{"b": 2, "a": 1}'   ← khác chuỗi, cùng dữ liệu
\`\`\`

Nếu bạn băm hai chuỗi này để phát hiện thay đổi, bạn sẽ báo "dữ liệu đã đổi" trong khi thực tế không hề.

\`\`\`python
import json

def canonical_json(obj):
    return json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
\`\`\`

**Từng tham số giải quyết một nguồn sai khác:**

| Tham số | Loại bỏ sự khác biệt do |
|---|---|
| \`sort_keys=True\` | thứ tự chèn khoá (áp dụng đệ quy cho mọi tầng) |
| \`separators=(",", ":")\` | khoảng trắng trang trí |
| \`ensure_ascii=False\` | cách biểu diễn ký tự Unicode |

**Vì sao \`ensure_ascii=False\` lại quan trọng ngoài chuyện hiển thị?** Vì nó ảnh hưởng tới **kích thước
byte**: \`"Hà Nội"\` giữ nguyên tốn 8 byte UTF-8, còn khi escape thành \`\\u00e0...\` thì phình lên gấp nhiều
lần. Với hệ thống truyền hàng triệu bản ghi, đây là khác biệt thật về băng thông và chi phí lưu trữ.

**Cảnh báo về giới hạn:** chuẩn hoá chỉ có ý nghĩa nếu dữ liệu đầu vào đã đi qua JSON. Như bạn đã thấy ở
quiz, \`tuple\` biến thành list và khoá số biến thành chuỗi — nên hãy chuẩn hoá **dữ liệu đã đọc từ JSON**,
đừng chuẩn hoá object Python thuần rồi mong nó khớp với bản đã round-trip. Số thực cũng là một cái bẫy
riêng: \`1.0\` và \`1\` cho hai chuỗi khác nhau.
`,
      solution: `import json


def canonical_json(obj):
    return json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(",", ":"))`,
      complexity: {
        question: 'Độ phức tạp thời gian, biết object có tổng n phần tử và mỗi object con có tối đa k khoá?',
        options: [
          'O(n log k) — mỗi phần tử được ghi một lần, cộng chi phí sắp xếp khoá ở từng tầng',
          'O(n) vì sắp xếp khoá là miễn phí',
          'O(n²)',
          'O(n log n) vì phải sắp xếp toàn bộ dữ liệu một lần',
        ],
        answer: 0,
        why: 'Việc tuần tự hoá duyệt qua mỗi phần tử đúng một lần → O(n). Thêm vào đó, `sort_keys=True` sắp xếp danh sách khoá của TỪNG object con, tốn O(k log k) mỗi object; cộng dồn lại cho toàn bộ dữ liệu ra O(n log k). Chi phí sắp xếp này là cái giá rất rẻ để đổi lấy tính tất định.',
      },
      realWorld: 'Băm payload để phát hiện thay đổi (ETag, cache key), ký số webhook và API request (chữ ký chỉ đúng khi hai bên tạo ra byte y hệt nhau), lưu snapshot cấu hình để `git diff` gọn gàng, và so sánh kết quả trong test tích hợp. Bất cứ khi nào bạn thấy "hai bản ghi giống hệt nhau mà hệ thống báo khác nhau", nguyên nhân thường là thiếu bước chuẩn hoá này.',
    },
  ],
},
];
