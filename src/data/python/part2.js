/**
 * LỘ TRÌNH PYTHON — MODULE 2: Cấu trúc điều khiển, Hàm & Phạm vi biến
 */

export default [
/* ==================================================================== */
{
  id: 'py-control-flow',
  name: 'Cấu trúc điều khiển, Hàm & Phạm vi biến',
  en: 'Control Flow, Functions & Scope',
  icon: '🔁',
  summary: 'Vòng lặp for/while không lạ, nhưng Python có vài vũ khí JS không có: for-else, *args/**kwargs, và một cái bẫy tham số mặc định khiến cả dân senior thỉnh thoảng vẫn dính.',
  lesson: `
## 1. Vấn đề gốc

Bạn đã quen \`for\`, \`while\`, \`function\` từ JS. Phần khó không nằm ở cú pháp lặp — nó nằm ở **những chỗ
Python "im lặng" làm một việc khác với trực giác JS của bạn**: tham số mặc định chỉ được tạo **một lần**,
biến trong closure bị **đóng theo tham chiếu** chứ không theo giá trị tại thời điểm tạo, và phạm vi biến
(scope) có luật riêng gọi tắt là LEGB.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Hàm nhận số lượng đối số bất kỳ | \`function f(...args)\` | \`def f(*args):\` |
| Hàm nhận "object tuỳ chọn" | \`function f({a, b} = {})\` | \`def f(**kwargs):\` |
| Bắt buộc đối số dạng từ khoá | không có cơ chế riêng | \`def f(a, *, b):\` — \`b\` BẮT BUỘC truyền dạng \`b=...\` |
| Vòng lặp có "không tìm thấy gì" | cờ boolean thủ công | \`for ... else:\` — \`else\` chạy khi vòng lặp **không** bị \`break\` |
| Sửa biến ngoài từ hàm lồng | biến ngoài tự "nhìn thấy" được (closure) | phải khai báo \`nonlocal\` mới được **gán lại** (đọc thì không cần) |

## 3. Ý tưởng cốt lõi #1: Tham số mặc định chỉ được tạo MỘT LẦN

Đây là bẫy Python nổi tiếng nhất — kể cả lập trình viên nhiều năm kinh nghiệm vẫn có lúc quên:

\`\`\`python
def them_don_hang(item, gio_hang=[]):   # NGUY HIỂM
    gio_hang.append(item)
    return gio_hang

a = them_don_hang("táo")        # ["táo"]
b = them_don_hang("cam")        # ["táo", "cam"]  <-- KHÔNG PHẢI ["cam"] !
\`\`\`

**Vì sao?** Trong Python, biểu thức mặc định (\`gio_hang=[]\`) được **thực thi đúng một lần**, ngay lúc
\`def\` chạy (lúc định nghĩa hàm) — không phải mỗi lần hàm được gọi. Cái \`list\` rỗng đó được tạo **một
lần duy nhất** và toàn bộ các lần gọi hàm sau đó (không truyền \`gio_hang\`) đều **dùng chung** đúng object
đó. Vì list mutable, mỗi lần gọi lại làm nó phình to thêm.

> **Quy tắc sống còn:** không bao giờ dùng \`list\`, \`dict\`, \`set\` (mutable) làm giá trị mặc định. Dùng
> \`None\` làm mặc định, rồi tạo mới bên trong thân hàm:
> \`\`\`python
> def them_don_hang(item, gio_hang=None):
>     if gio_hang is None:
>         gio_hang = []
>     gio_hang.append(item)
>     return gio_hang
> \`\`\`

## 4. Ý tưởng cốt lõi #2: Closure đóng biến theo THAM CHIẾU (late binding)

\`\`\`python
funcs = []
for i in range(3):
    funcs.append(lambda x: x + i)   # BẪY

print([f(0) for f in funcs])   # [2, 2, 2] — KHÔNG PHẢI [0, 1, 2] !
\`\`\`

Mỗi \`lambda\` không "chụp ảnh" giá trị \`i\` tại thời điểm tạo — nó chỉ nhớ **tên biến** \`i\`, và tra cứu
giá trị của \`i\` **tại thời điểm được GỌI**. Sau khi vòng lặp kết thúc, \`i\` mang giá trị cuối cùng (2),
nên cả 3 hàm đều thấy \`i = 2\`.

**Cách sửa chuẩn: ép giá trị hiện tại thành THAM SỐ MẶC ĐỊNH của chính lambda đó** — tham số mặc định
*được định giá ngay lúc tạo lambda* (đúng cơ chế ở mục 3, nhưng lần này ta lợi dụng nó có chủ đích):

\`\`\`python
funcs = []
for i in range(3):
    funcs.append(lambda x, i=i: x + i)   # i=i chụp giá trị NGAY LÚC NÀY

print([f(0) for f in funcs])   # [0, 1, 2]  — đúng!
\`\`\`

## 5. \`*args\`, \`**kwargs\` và đối số bắt buộc dạng từ khoá

\`\`\`python
def log(*args, **kwargs):
    print(args)     # tuple — mọi đối số vị trí thừa
    print(kwargs)   # dict — mọi đối số từ khoá thừa

log(1, 2, mode="debug")   # args=(1, 2), kwargs={'mode': 'debug'}

def moi_toa_do(x, y, *, z=0):   # dấu * đơn độc: mọi thứ SAU nó phải truyền bằng tên
    return (x, y, z)

moi_toa_do(1, 2, z=3)   # OK
moi_toa_do(1, 2, 3)     # LỖI — z phải viết z=3
\`\`\`

## 6. \`for ... else\` — vòng lặp có "không tìm thấy"

\`else\` sau \`for\`/\`while\` chạy khi vòng lặp **kết thúc bình thường** (không bị \`break\`). Đây là cách
Python thay thế cho pattern "biến cờ boolean" quen thuộc trong JS:

\`\`\`python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            break          # tìm thấy ước số -> không phải số nguyên tố
    else:
        return True        # vòng lặp chạy hết mà KHÔNG break -> không tìm thấy ước nào
    return False
\`\`\`

## 7. Bẫy thường gặp

- **Tham số mặc định mutable** (\`def f(x=[])\`) — xem mục 3. Đây là lỗi số một khi chuyển từ JS sang Python.
- **Late binding trong closure vòng lặp** — xem mục 4. Đặc biệt hay gặp khi tạo nhiều callback trong \`for\`.
- **Quên \`nonlocal\`**: hàm lồng có thể ĐỌC biến ngoài tự do, nhưng muốn GÁN LẠI biến ngoài phải khai báo
  \`nonlocal ten_bien\` (hoặc \`global\` nếu ở cấp module) — nếu không, Python coi đó là biến LOCAL mới và
  báo lỗi \`UnboundLocalError\`.
- **Nhầm \`*args\` là bắt buộc**: \`*args\` là RỖNG (tuple rỗng) nếu không truyền gì thêm, không lỗi.

## 8. Ứng dụng thực tế

- **Decorator và wrapper function** (sẽ học ở module sau) dựa 100% vào \`*args, **kwargs\` để "chuyển tiếp"
  lời gọi mà không cần biết chữ ký hàm gốc.
- **Factory tạo nhiều callback** (event handlers, validators theo cấu hình) là nơi bẫy late-binding closure
  gây bug im lặng nhiều nhất trong code thực tế — đặc biệt khi tạo callback trong vòng lặp cho UI hoặc test.
- **API thiết kế tốt dùng keyword-only** (\`*,\`) để bắt buộc người gọi ghi rõ tên tham số dễ nhầm (ví dụ
  \`timeout=\`, \`retries=\`) thay vì truyền theo vị trí dễ đọc sai thứ tự.
`,
  quiz: [
    {
      q: 'Đoạn code sau in ra gì?\n\ndef add_item(x, items=[]):\n    items.append(x)\n    return items\n\nprint(add_item(1))\nprint(add_item(2))',
      options: ['[1]  rồi  [2]', '[1]  rồi  [1, 2]', '[1, 2]  rồi  [1, 2]', 'Lỗi: items chưa được khai báo'],
      answer: 1,
      why: 'Giá trị mặc định `[]` được tạo MỘT LẦN lúc định nghĩa hàm, và mọi lần gọi không truyền items đều dùng chung object đó. Lần gọi thứ hai thấy list đã có sẵn phần tử từ lần gọi trước.',
    },
    {
      q: 'Cách sửa đúng cho bẫy tham số mặc định mutable ở câu trên là gì?',
      options: [
        'Đổi `items=[]` thành `items=list()`',
        'Đổi `items=[]` thành `items=None`, rồi bên trong hàm: `if items is None: items = []`',
        'Thêm từ khoá `const` trước `items`',
        'Không có cách sửa, phải luôn truyền items tường minh',
      ],
      answer: 1,
      why: '`items=list()` vẫn bị lỗi y hệt `items=[]` vì `list()` cũng chỉ chạy một lần lúc định nghĩa hàm. Cách chuẩn Python là dùng `None` làm cờ báo "chưa truyền" rồi tạo list mới bên trong thân hàm mỗi lần gọi.',
    },
    {
      q: 'funcs = [lambda x: x + i for i in range(3)] (list comprehension thay vì vòng for thường). Gọi funcs[0](0) cho kết quả gì?',
      options: ['0', '1', '2', 'Lỗi'],
      answer: 2,
      why: 'List comprehension vẫn tạo closure đóng theo THAM CHIẾU biến `i`, giống hệt vòng for thường — không phải cú pháp comprehension "an toàn" hơn. Sau khi comprehension chạy xong, i=2, nên mọi lambda đều thấy i=2.',
    },
    {
      q: 'Trong `def f(a, *, b=1): ...`, dấu `*` đứng riêng một mình có tác dụng gì?',
      options: [
        'Cho phép `f` nhận số lượng đối số vị trí bất kỳ',
        'Bắt buộc mọi tham số phía SAU nó (ở đây là `b`) phải được truyền dưới dạng từ khoá `b=...`, không được truyền theo vị trí',
        'Là lỗi cú pháp vì `*` phải đi kèm tên biến',
        'Biến `b` thành tham số bắt buộc, không được có giá trị mặc định',
      ],
      answer: 1,
      why: 'Dấu `*` đứng một mình trong danh sách tham số là một "cột mốc" — nó không nhận đối số, chỉ đánh dấu ranh giới: mọi tham số sau nó bắt buộc phải gọi bằng tên (keyword-only argument).',
    },
  ],
  problems: [
    {
      id: 'py-apply-adders',
      title: 'Sửa bẫy closure trong vòng lặp',
      en: 'Fix the Closure Trap',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'apply_adders',
      lang: 'python',
      statement: `
Viết hàm \`apply_adders(n, x)\`:
1. Tạo ra \`n\` "hàm cộng" (closure), hàm thứ \`i\` (0-indexed) khi được gọi với đối số \`x\` phải trả về
   \`x + i\`.
2. Áp dụng cả \`n\` hàm đó lên \`x\`, trả về danh sách kết quả theo đúng thứ tự \`i = 0..n-1\`.

**Ví dụ**
- \`apply_adders(3, 10)\` → \`[10, 11, 12]\`
- \`apply_adders(1, 5)\` → \`[5]\`
- \`apply_adders(5, 0)\` → \`[0, 1, 2, 3, 4]\`

> Đây là bài luyện trực tiếp bẫy **late binding trong closure** đã học ở bài giảng. Nếu bạn tạo closure
> "ngây thơ" trong vòng lặp, cả \`n\` hàm sẽ cho cùng một kết quả sai.
`,
      starter: `def apply_adders(n, x):\n    # 1. Tạo n closure, ham thu i tra ve x + i khi goi\n    # 2. Ap dung tat ca len x, tra ve list ket qua theo dung thu tu\n    \n`,
      tests: [
        { args: [3, 10], expected: [10, 11, 12], name: 'Ví dụ cơ bản' },
        { args: [1, 5], expected: [5], name: 'Chỉ 1 hàm' },
        { args: [5, 0], expected: [0, 1, 2, 3, 4], name: 'x = 0' },
        { args: [4, -2], expected: [-2, -1, 0, 1], name: 'x âm' },
        { args: [0, 100], expected: [], name: 'n = 0 -> danh sách rỗng' },
      ],
      hints: [
        'Nếu bạn viết `funcs.append(lambda val: val + i)` bên trong vòng `for i in range(n):`, TẤT CẢ các hàm sẽ dùng chung biến `i` và đều thấy giá trị CUỐI CÙNG của nó khi được gọi — đây chính là bẫy đã học.',
        'Cách sửa: ép giá trị `i` hiện tại thành THAM SỐ MẶC ĐỊNH của lambda — tham số mặc định được định giá NGAY LÚC TẠO, không phải lúc gọi: `lambda val, i=i: val + i`.',
        'Sau khi có danh sách `n` closures đúng, bước 2 chỉ là `[f(x) for f in funcs]` — áp dụng từng hàm lên `x` theo đúng thứ tự.',
      ],
      diagnostics: [
        { test: 'lambda\\s+\\w+\\s*:\\s*\\w+\\s*\\+\\s*i\\b', message: 'Lambda này chỉ có MỘT tham số trước dấu hai chấm — nó KHÔNG chụp giá trị `i` tại thời điểm tạo, mà sẽ tra `i` lúc được GỌI, khi vòng lặp đã chạy xong. Hãy thêm `i=i` vào danh sách tham số: `lambda val, i=i: val + i`.' },
      ],
      approach: `
Bài này là bản áp dụng trực tiếp của mục "Ý tưởng cốt lõi #2" trong bài giảng.

**Vì sao closure "ngây thơ" sai?** Một hàm (kể cả lambda) không lưu GIÁ TRỊ của biến tự do — nó chỉ lưu
**tên biến** và tra cứu ngăn xếp phạm vi (scope) mỗi khi được gọi. Vòng lặp \`for i in range(n)\` dùng
LẠI cùng một biến \`i\` qua từng vòng (không tạo biến mới mỗi lần), nên khi vòng lặp kết thúc, mọi closure
đã tạo đều nhìn thấy \`i\` ở giá trị cuối cùng.

**Cách sửa hoạt động vì sao?** Tham số mặc định của hàm (\`def\`/\`lambda\`) được **định giá đúng một lần,
ngay tại thời điểm định nghĩa hàm** (đã học ở mục "Ý tưởng cốt lõi #1" — cùng một cơ chế, nhưng lần trước
là bẫy, lần này ta chủ động lợi dụng nó). Viết \`lambda val, i=i: val + i\` bên trong vòng lặp nghĩa là:
"tạo tham số mặc định tên trùng \`i\`, giá trị mặc định = giá trị của \`i\` bên ngoài **ngay lúc này**" —
mỗi lần lặp tạo ra một lambda với một giá trị \`i\` mặc định khác nhau, đóng băng đúng ý muốn.
`,
      solution: `def apply_adders(n, x):
    funcs = []
    for i in range(n):
        funcs.append(lambda val, i=i: val + i)
    return [f(x) for f in funcs]`,
      complexity: {
        question: 'apply_adders(n, x) có độ phức tạp thời gian nào theo n?',
        options: ['O(1)', 'O(n) — tạo n closure rồi gọi n lần, mỗi thao tác O(1)', 'O(n²)', 'O(n log n)'],
        answer: 1,
        why: 'Tạo n closure tốn O(n), rồi gọi từng closure một lần tốn thêm O(n) — tổng vẫn tuyến tính O(n), vì mỗi closure chỉ làm một phép cộng O(1).',
      },
      realWorld: 'Tạo nhiều event handler/callback theo cấu hình trong vòng lặp (ví dụ: gắn nút bấm cho từng item trong danh sách UI, hoặc tạo nhiều validator cho từng field form) — đây là nơi bug late-binding closure xuất hiện âm thầm nhiều nhất trong code thực tế, vì mọi test thủ công "bấm thử 1 nút" đều không lộ ra bug.',
    },
    {
      id: 'py-merge-configs',
      title: 'Gộp nhiều cấu hình',
      en: 'Merge Configs',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'merge_configs',
      lang: 'python',
      statement: `
Viết hàm \`merge_configs(*dicts, **overrides)\`:
- Nhận **số lượng dict bất kỳ** làm đối số vị trí, gộp chúng lại theo thứ tự — dict sau **ghi đè** khoá
  trùng của dict trước.
- Sau đó áp dụng thêm các đối số từ khoá (\`**overrides\`) — chúng có độ ưu tiên **cao nhất**, ghi đè lên
  kết quả gộp từ các dict.
- Trả về một dict mới (không được sửa các dict đầu vào).

**Ví dụ**
- \`merge_configs({"a": 1}, {"a": 2, "b": 3})\` → \`{"a": 2, "b": 3}\`
- \`merge_configs({"timeout": 5}, timeout=10)\` → \`{"timeout": 10}\`
- \`merge_configs({"a": 1}, {"b": 2}, a=99)\` → \`{"a": 99, "b": 2}\`
`,
      starter: `def merge_configs(*dicts, **overrides):\n    # Gop cac dict theo thu tu, sau do ap dung overrides voi uu tien cao nhat\n    \n`,
      tests: [
        { args: [{ a: 1 }, { a: 2, b: 3 }], expected: { a: 2, b: 3 }, name: 'Dict sau ghi đè dict trước' },
        { args: [{ timeout: 5 }], expected: { timeout: 5 }, name: 'Chỉ 1 dict, không có overrides' },
        { args: [{ a: 1 }, { b: 2 }], expected: { a: 1, b: 2 }, name: 'Không trùng khoá — cộng gộp' },
        { args: [], expected: {}, name: 'Không có dict nào -> dict rỗng' },
      ],
      checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
      hints: [
        '`*dicts` gom mọi đối số vị trí thành một `tuple` các dict. Bạn cần gộp chúng THEO THỨ TỰ, dict đến sau ghi đè khoá trùng của dict đến trước.',
        'Dict có phương thức `update(other)` — sửa dict TẠI CHỖ bằng nội dung của `other`, khoá trùng bị ghi đè. Dùng một dict `result = {}` rồi `result.update(d)` cho từng `d` trong `dicts`.',
        'Đề bài yêu cầu KHÔNG được sửa dict đầu vào — bắt đầu với `result = {}` (dict mới, rỗng) rồi update dần là an toàn, vì bạn không bao giờ gọi `.update()` trên chính các dict đầu vào. Cuối cùng `result.update(overrides)` để áp `**overrides` với ưu tiên cao nhất.',
      ],
      diagnostics: [
        { test: 'dicts\\[0\\]\\.update', message: 'Gọi `.update()` trực tiếp trên một trong các dict đầu vào (vd `dicts[0]`) sẽ SỬA dict đó tại chỗ — vi phạm yêu cầu "không được sửa dict đầu vào". Hãy bắt đầu từ một dict rỗng mới.' },
      ],
      approach: `
Bài này luyện \`*args\`/\`**kwargs\` — cặp cú pháp nền tảng cho mọi hàm "wrapper" trong Python (decorator,
proxy, adapter...) mà bạn sẽ gặp lại ở các module sau.

- \`*dicts\` thu thập **mọi đối số vị trí** (bao nhiêu cũng được, kể cả 0) thành một \`tuple\`.
- \`**overrides\` thu thập **mọi đối số từ khoá** không khớp tên tham số nào khác thành một \`dict\`.

**Thứ tự ưu tiên = thứ tự merge.** Vì \`dict.update()\` ghi đè khoá trùng, ta chỉ cần merge tuần tự theo
đúng thứ tự ưu tiên tăng dần: các dict trong \`*dicts\` trước (theo thứ tự xuất hiện), rồi \`**overrides\`
merge SAU CÙNG để đảm bảo độ ưu tiên cao nhất.

**Vì sao phải bắt đầu từ dict rỗng mới, không phải \`dicts[0]\`?** Vì \`{}.update(dicts[0])\` tạo ra một
bản sao gộp, còn \`dicts[0].update(dicts[1])\` sẽ **sửa tại chỗ** object \`dicts[0]\` — vi phạm nguyên tắc
"không side-effect lên input" mà hầu hết API cấu hình thực tế đều yêu cầu (người gọi hàm không nên bất
ngờ thấy dict họ truyền vào bị thay đổi).
`,
      solution: `def merge_configs(*dicts, **overrides):
    result = {}
    for d in dicts:
        result.update(d)
    result.update(overrides)
    return result`,
      complexity: {
        question: 'Với k dict, tổng cộng m cặp khoá-giá trị, độ phức tạp thời gian của merge_configs?',
        options: ['O(1)', 'O(k)', 'O(m) — mỗi cặp khoá-giá trị được xử lý đúng một lần qua update()', 'O(m²)'],
        answer: 2,
        why: 'Mỗi lệnh `update()` duyệt qua các cặp khoá-giá trị của dict nguồn một lần; tổng số cặp xử lý qua tất cả các lệnh update là m, nên tổng chi phí tuyến tính theo m (không phụ thuộc số lượng dict k một cách riêng biệt).',
      },
      realWorld: 'Hệ thống cấu hình phân lớp (layered config): giá trị mặc định của ứng dụng → cấu hình theo môi trường (dev/staging/prod) → biến môi trường → tham số dòng lệnh, mỗi lớp sau ghi đè lớp trước. Đây chính xác là pattern `*dicts` + `**overrides`.',
    },
    {
      id: 'py-primes-only',
      title: 'Lọc số nguyên tố với for-else',
      en: 'Filter Primes with for-else',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'primes_only',
      lang: 'python',
      statement: `
Viết hàm \`primes_only(nums)\` trả về danh sách chỉ gồm các **số nguyên tố** trong \`nums\`, giữ nguyên
thứ tự xuất hiện.

**Ví dụ**
- \`primes_only([2, 3, 4, 5, 6, 7])\` → \`[2, 3, 5, 7]\`
- \`primes_only([1, 0, -5])\` → \`[]\` (1, 0 và số âm không phải số nguyên tố)
- \`primes_only([97, 100])\` → \`[97]\`

> Gợi ý: hãy viết một hàm phụ \`is_prime(n)\` dùng cấu trúc \`for ... else\` đã học trong bài giảng — đây
> là ví dụ kinh điển nhất để hiểu \`else\` của vòng lặp hoạt động ra sao.
`,
      starter: `def primes_only(nums):\n    def is_prime(n):\n        if n < 2:\n            return False\n        # Dung for...else: neu vong lap chay het khong break -> la so nguyen to\n        \n    \n`,
      tests: [
        { args: [[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]], expected: [2, 3, 5, 7, 11], name: 'Dãy 2..11' },
        { args: [[]], expected: [], name: 'Danh sách rỗng' },
        { args: [[1, 0, -5]], expected: [], name: 'Không có số nguyên tố nào' },
        { args: [[97, 100]], expected: [97], name: '97 nguyên tố, 100 thì không' },
        { args: [[2]], expected: [2], name: 'Số nguyên tố nhỏ nhất' },
      ],
      hints: [
        'Một số `n` là nguyên tố nếu `n >= 2` và không chia hết cho bất kỳ số nào từ 2 đến căn bậc hai của `n`. Chỉ cần thử ước tới `int(n ** 0.5) + 1` là đủ, không cần thử tới `n`.',
        'Dùng `for i in range(2, int(n ** 0.5) + 1): if n % i == 0: break`. Nếu vòng lặp này chạy hết mà KHÔNG gặp `break`, phần `else:` sẽ chạy — đó chính là lúc bạn kết luận `n` là số nguyên tố.',
        'Sau khi có `is_prime(n)` đúng, phần còn lại chỉ là lọc: `[x for x in nums if is_prime(x)]` (list comprehension) hoặc vòng `for` thường với `.append()`.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,150}for', message: 'Kiểm tra n có phải nguyên tố chỉ cần MỘT vòng lặp thử ước số (tới căn bậc hai của n), không cần vòng lặp lồng nhau.' },
      ],
      approach: `
Đây là ví dụ **kinh điển nhất** để hiểu \`for ... else\` trong toàn bộ cộng đồng Python — hãy nhớ kỹ mẫu
này vì nó sẽ xuất hiện lại bất cứ khi nào bạn cần diễn đạt "tìm kiếm thất bại" mà không cần biến cờ:

\`\`\`python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            break            # tìm thấy ước -> chắc chắn KHÔNG phải nguyên tố
    else:
        return True          # vòng lặp KHÔNG bị break -> không có ước nào -> nguyên tố
    return False              # chỉ chạy tới đây khi có break ở trên
\`\`\`

**So với cách viết "kiểu JS"** (dùng biến cờ \`found = False\`, rồi \`if found: ...\`), \`for...else\` loại
bỏ hẳn nhu cầu khai báo và theo dõi một biến trạng thái phụ — vòng lặp TỰ nó "nhớ" là có bị ngắt hay không.

**Vì sao chỉ cần thử ước tới \`√n\`?** Nếu \`n = a × b\` với \`a ≤ b\`, thì chắc chắn \`a ≤ √n\` — nếu tồn
tại một cặp ước, ước nhỏ hơn luôn nằm trong khoảng \`[2, √n]\`. Đây là tối ưu hoá kinh điển giảm độ phức
tạp kiểm tra nguyên tố từ O(n) xuống O(√n).
`,
      solution: `def primes_only(nums):
    def is_prime(n):
        if n < 2:
            return False
        for i in range(2, int(n ** 0.5) + 1):
            if n % i == 0:
                break
        else:
            return True
        return False

    return [x for x in nums if is_prime(x)]`,
      complexity: {
        question: 'Kiểm tra is_prime(n) có độ phức tạp thời gian nào theo n?',
        options: ['O(n)', 'O(√n) — chỉ cần thử ước tới căn bậc hai của n', 'O(log n)', 'O(1)'],
        answer: 1,
        why: 'Vòng lặp chạy từ 2 tới int(n**0.5)+1, tức khoảng √n bước — đây là lý do giới hạn thử ước tới căn bậc hai là một tối ưu hoá quan trọng so với thử tới n.',
      },
      realWorld: 'Cấu trúc for-else dùng bất cứ đâu cần "tìm kiếm rồi hành động khác nhau tuỳ có tìm thấy hay không" mà không cần biến cờ phụ: kiểm tra tính hợp lệ (validation) khi duyệt qua danh sách quy tắc, tìm kiếm phần tử khớp điều kiện trong xử lý dữ liệu.',
    },
  ],
},
];
