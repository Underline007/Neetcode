/**
 * LỘ TRÌNH PYTHON — MODULE 13: Testing với pytest
 */

export default [
/* ==================================================================== */
{
  id: 'py-testing',
  name: 'Testing với pytest',
  en: 'Testing with pytest',
  icon: '✅',
  summary: 'Vì sao cả chương trình học này luôn "chấm điểm bằng test" — và cách áp dụng đúng tư duy đó khi viết code Python thật bằng `pytest`, framework test phổ biến nhất của hệ sinh thái Python.',
  lesson: `
## 1. Vấn đề gốc

Mọi bài tập trong app này đều được chấm bằng một bộ **test case cố định** — đây không phải cách làm riêng
của app, mà chính là cách các dự án Python thật vận hành: viết code xong, viết (hoặc đã có sẵn) test để xác
nhận code đúng, và **chạy lại TOÀN BỘ test đó mỗi khi sửa code** để chắc chắn không làm hỏng thứ gì đã chạy
đúng trước đó (gọi là **regression testing**). \`pytest\` là công cụ phổ biến nhất trong Python để tự động
hoá việc này.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript (Jest) | Python (pytest) |
|---|---|---|
| Định nghĩa một test | \`test("mo ta", () => { ... })\`/\`it(...)\` | hàm bắt đầu bằng \`test_\` trong file \`test_*.py\` (không cần đăng ký thủ công) |
| Khẳng định kết quả đúng | \`expect(x).toBe(y)\` | \`assert x == y\` — dùng \`assert\` chuẩn của Python, pytest tự "đọc hiểu" biểu thức để báo lỗi chi tiết |
| Setup/teardown dùng chung | \`beforeEach\`/\`afterEach\` | \`@pytest.fixture\` — hàm fixture được "tiêm" vào test qua THAM SỐ cùng tên |
| Chạy nhiều bộ input cho cùng 1 test | \`test.each([...])(...)\` | \`@pytest.mark.parametrize("a,b,expected", [...])\` |
| Test một đoạn code PHẢI raise lỗi | \`expect(() => fn()).toThrow()\` | \`with pytest.raises(ValueError): fn()\` |
| So sánh số thực (tránh lỗi làm tròn) | thường tự viết hàm so sánh gần đúng | \`assert x == pytest.approx(y)\` |

## 3. Ý tưởng cốt lõi

**(a) Test discovery theo QUY ƯỚC TÊN, không cần đăng ký thủ công.** \`pytest\` tự động tìm và chạy: file có
tên \`test_*.py\` hoặc \`*_test.py\`, bên trong đó là các hàm có tên bắt đầu bằng \`test_\`. Một hàm ĐẶT SAI
TÊN (ví dụ \`kiem_tra_cong()\` thay vì \`test_cong()\`) sẽ **bị bỏ qua ÂM THẦM**, không báo lỗi gì — đây là lý
do quy ước đặt tên cực kỳ quan trọng trong hệ sinh thái pytest.

**(b) \`assert\` chuẩn của Python là đủ — không cần \`self.assertEqual(...)\` như \`unittest\` cũ.** \`pytest\`
"viết lại" (rewrite) biểu thức \`assert\` lúc chạy để hiển thị THÔNG TIN CHI TIẾT khi thất bại (giá trị thực
tế của từng biến trong biểu thức), nên chỉ cần viết \`assert ket_qua == ky_vong\` là đủ, không cần các
phương thức \`assert*\` chuyên biệt.

**(c) Table-driven test (\`parametrize\`)**: thay vì viết 5 hàm \`test_case_1\`, \`test_case_2\`... gần như
giống hệt nhau (chỉ khác input/expected), viết MỘT hàm test, khai báo bảng \`(input, expected)\` bằng
\`@pytest.mark.parametrize\`, pytest tự chạy hàm đó một lần cho MỖI dòng trong bảng, báo lỗi riêng biệt cho
từng dòng nếu có dòng nào sai.

**(d) So sánh số thực KHÔNG BAO GIỜ dùng \`==\` trực tiếp** — sai số làm tròn dấu phẩy động (floating point)
khiến \`0.1 + 0.2 == 0.3\` cho kết quả \`False\` trong hầu hết ngôn ngữ lập trình (kể cả Python), dùng
\`pytest.approx(gia_tri)\` (hoặc tự viết hàm so sánh với sai số cho phép \`tol\`) để so sánh "gần đúng" thay
vì "bằng tuyệt đối".

## 4. Dấu hiệu nhận biết

| Thấy trong tình huống | Nghĩ tới |
|---|---|
| "test này chạy một mình ổn, chạy cùng test khác lại lỗi" | test đang chia sẻ trạng thái toàn cục (global state) — mỗi test PHẢI độc lập, không phụ thuộc thứ tự chạy |
| "so sánh kết quả phép tính có phần thập phân" | đừng dùng \`==\`, dùng \`pytest.approx\`/so sánh với sai số cho phép |
| "cùng logic test, chỉ khác input/expected" | \`@pytest.mark.parametrize\` thay vì copy-paste nhiều hàm test |
| "nhiều test cần cùng một dữ liệu/kết nối chuẩn bị sẵn" | \`@pytest.fixture\` |
| "test hàm PHẢI raise lỗi khi input sai" | \`with pytest.raises(LoaiLoi):\` |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
# test_math_utils.py
import pytest
from math_utils import discount_price, divide

def test_discount_basic():
    assert discount_price(100, 10) == 90.0

@pytest.mark.parametrize("price,pct,expected", [
    (100, 10, 90.0),
    (50, 50, 25.0),
    (100, 0, 100.0),
])
def test_discount_table(price, pct, expected):
    assert discount_price(price, pct) == expected

def test_divide_by_zero_raises():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)

def test_float_result_use_approx():
    assert (0.1 + 0.2) == pytest.approx(0.3)   # KHÔNG dùng == trực tiếp với float

@pytest.fixture
def sample_data():
    return [1, 2, 3]

def test_sum_with_fixture(sample_data):     # pytest tự "tiêm" sample_data vào theo tên tham số
    assert sum(sample_data) == 6
\`\`\`

## 6. Bẫy thường gặp

- **So sánh float bằng \`==\` trong test**: \`assert tinh_lai_suat(...) == 15.7\` có thể fail dù logic đúng,
  chỉ vì sai số làm tròn ở chữ số thập phân thứ 10 không ai để ý — luôn dùng \`pytest.approx\` cho kết quả
  phép tính có phần thập phân.
- **Đặt tên hàm test sai quy ước**: một hàm tên \`kiemtra_tong()\` thay vì \`test_tong()\` sẽ bị pytest **bỏ
  qua hoàn toàn, không báo lỗi, không cảnh báo** — bạn tưởng mình đã có test bảo vệ code, nhưng thực ra nó
  chưa từng được chạy.
- **Test phụ thuộc lẫn nhau qua trạng thái chia sẻ (shared global state)**: test A sửa một biến toàn cục,
  test B (chạy sau) vô tình dựa vào giá trị đã bị A thay đổi — kết quả test B khi đó phụ thuộc vào THỨ TỰ
  chạy, gây ra lỗi "chạy riêng thì pass, chạy cùng bộ thì fail" cực kỳ khó tìm nguyên nhân.
- **Viết một test khổng lồ kiểm tra QUÁ NHIỀU thứ cùng lúc**: khi fail, rất khó biết chính xác PHẦN NÀO sai
  — nên tách thành nhiều test nhỏ, mỗi test chỉ khẳng định MỘT hành vi cụ thể, giúp thông báo lỗi trỏ thẳng
  tới nguyên nhân.

## 7. Ứng dụng thực tế

- **CI/CD pipeline chạy \`pytest\` tự động trên mọi Pull Request**: chặn merge nếu có test fail, đảm bảo code
  mới không phá vỡ hành vi cũ (regression) trước khi lên production.
- **TDD (Test-Driven Development)**: viết test THẤT BẠI trước (mô tả hành vi mong muốn), rồi viết code tới
  khi test đó pass — giúp tập trung đúng vào yêu cầu thay vì code lan man.
- **Coverage report** (đo % dòng code được test chạy qua) giúp phát hiện những phần logic quan trọng chưa
  hề được kiểm thử, đặc biệt là các nhánh xử lý lỗi hiếm gặp.
`,
  quiz: [
    {
      q: 'pytest tự động NHẬN DIỆN một hàm là test case dựa vào điều gì?',
      options: [
        'Phải đăng ký thủ công tên hàm test trong một file cấu hình riêng',
        'Quy ước ĐẶT TÊN: hàm nằm trong file `test_*.py`/`*_test.py` và có tên bắt đầu bằng `test_` — pytest tự động tìm (discover) mà không cần đăng ký thủ công',
        'Hàm phải có decorator `@test` ở phía trên',
        'Hàm phải được import vào một file `__main__.py` đặc biệt',
      ],
      answer: 1,
      why: 'pytest dùng cơ chế "test discovery" dựa hoàn toàn vào quy ước đặt tên file và tên hàm — đây cũng là lý do một hàm đặt sai tên (không bắt đầu bằng `test_`) sẽ bị bỏ qua HOÀN TOÀN mà không có bất kỳ cảnh báo nào.',
    },
    {
      q: 'Vì sao không nên dùng `assert ket_qua == 0.3` để kiểm tra một phép tính trả về số thực (float) trong test?',
      options: [
        'Vì `assert` không hoạt động được với kiểu float',
        'Vì sai số làm tròn của số dấu phẩy động (floating point) có thể khiến hai giá trị "về mặt toán học bằng nhau" lại không bằng nhau tuyệt đối khi so bằng `==` (ví dụ `0.1 + 0.2 != 0.3` theo `==`) — nên dùng `pytest.approx` để so sánh gần đúng',
        'Vì `assert` chỉ hoạt động với số nguyên, không hoạt động với số thực',
        'Không có vấn đề gì, `==` luôn hoạt động chính xác với mọi số thực trong Python',
      ],
      answer: 1,
      why: 'Số dấu phẩy động không thể biểu diễn chính xác tuyệt đối mọi số thập phân trong hệ nhị phân — sai số cực nhỏ (thường ở các chữ số thập phân xa) khiến so sánh bằng tuyệt đối không đáng tin cậy. `pytest.approx` so sánh với một sai số cho phép hợp lý.',
    },
    {
      q: '`@pytest.mark.parametrize` giúp giải quyết vấn đề gì?',
      options: [
        'Chạy các test song song để tăng tốc độ',
        'Tránh phải viết nhiều hàm test gần giống hệt nhau (chỉ khác bộ input/expected) — khai báo một bảng dữ liệu, pytest tự chạy CÙNG một hàm test cho MỖI dòng trong bảng, báo lỗi riêng cho từng dòng nếu sai',
        'Tự động tạo ra dữ liệu test ngẫu nhiên',
        'Chỉ dùng được khi test không có tham số nào',
      ],
      answer: 1,
      why: 'Đây chính là kỹ thuật "table-driven test": khai báo nhiều bộ (input, expected) trong một bảng, tái sử dụng cùng một đoạn logic assert cho tất cả — giảm trùng lặp code và làm rõ ràng "test này đang kiểm tra những trường hợp cụ thể nào".',
    },
    {
      q: 'Vấn đề gì xảy ra khi hai test (ví dụ `test_a` và `test_b`) cùng đọc/ghi một BIẾN TOÀN CỤC (global state) dùng chung?',
      options: [
        'Không có vấn đề gì, pytest tự động cô lập trạng thái giữa các test',
        'Kết quả của một test có thể phụ thuộc vào THỨ TỰ CHẠY — test B có thể pass khi chạy sau test A (vì state đã bị A thay đổi theo hướng có lợi) nhưng fail khi chạy độc lập, gây khó khăn lớn khi debug',
        'pytest sẽ tự động báo lỗi ngay khi phát hiện hai test cùng dùng một biến toàn cục',
        'Chỉ ảnh hưởng tới tốc độ chạy test, không ảnh hưởng tới kết quả đúng/sai',
      ],
      answer: 1,
      why: 'Test tốt cần ĐỘC LẬP với nhau — không giả định về thứ tự chạy, không để lại "tác dụng phụ" ảnh hưởng tới test khác. Vi phạm nguyên tắc này tạo ra lớp lỗi rất khó tái hiện: "test lỗi khi chạy full suite, nhưng pass khi chạy riêng lẻ".',
    },
    {
      q: '`with pytest.raises(ValueError): fn()` dùng để làm gì?',
      options: [
        'Bắt và bỏ qua mọi lỗi mà `fn()` có thể ném ra, coi như test luôn pass',
        'Khẳng định rằng `fn()` PHẢI ném ra đúng `ValueError` khi chạy — nếu `fn()` chạy xong KHÔNG lỗi, hoặc ném loại lỗi KHÁC, test này sẽ fail',
        'Chạy `fn()` nhiều lần cho tới khi nó raise lỗi',
        'Chỉ dùng được trong fixture, không dùng được trực tiếp trong hàm test',
      ],
      answer: 1,
      why: '`pytest.raises` là cách chuẩn để test rằng một đoạn code "phải lỗi đúng cách" — ví dụ đảm bảo hàm validate input thực sự raise đúng loại exception khi nhận dữ liệu sai, thay vì âm thầm trả về giá trị sai hoặc raise nhầm loại lỗi khác.',
    },
  ],
  problems: [
    {
      id: 'py-table-driven-tests',
      title: 'Chạy test theo bảng (table-driven / parametrize)',
      en: 'Table-Driven Test Runner',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'run_table_tests',
      lang: 'python',
      statement: `
Cho sẵn hàm \`discount_price(price, pct)\` (tính giá sau khi giảm \`pct\`%, làm tròn 2 chữ số thập phân).

Viết hàm \`run_table_tests(cases)\` mô phỏng đúng cách \`@pytest.mark.parametrize\` hoạt động: \`cases\` là
một list, mỗi phần tử có dạng \`[args, expected]\` (\`args\` là list tham số truyền cho \`discount_price\`).
Với MỖI case, gọi \`discount_price(*args)\` và so sánh với \`expected\`, trả về **list các \`True\`/\`False\`**
tương ứng (đúng thứ tự các case).

**Ví dụ**
- \`run_table_tests([[[100, 10], 90.0], [[50, 50], 25.0]])\` → \`[True, True]\`
- \`run_table_tests([[[100, 10], 80.0]])\` → \`[False]\` (expected sai, discount_price thực trả 90.0)
`,
      starter: `def discount_price(price, pct):\n    return round(price * (1 - pct / 100), 2)\n\n\ndef run_table_tests(cases):\n    # Voi moi [args, expected] trong cases: goi discount_price(*args), so sanh expected\n    # Tra ve list[bool] tuong ung tung case\n    \n`,
      tests: [
        { args: [[[[100, 10], 90.0], [[50, 50], 25.0], [[100, 0], 100.0]]], expected: [true, true, true], name: 'Cả 3 case đều đúng' },
        { args: [[[[100, 10], 80.0]]], expected: [false], name: 'Một case expected sai -> False' },
        { args: [[]], expected: [], name: 'Bảng test rỗng' },
        { args: [[[[200, 25], 150.0], [[10, 100], 0.0]]], expected: [true, true], name: 'Giảm giá 25% và giảm 100%' },
        { args: [[[[80, 10], 72.0], [[80, 10], 99.0]]], expected: [true, false], name: 'Trộn lẫn case đúng và sai' },
      ],
      hints: [
        'Duyệt qua từng phần tử của `cases` — mỗi phần tử là một cặp `[args, expected]` (`args` bản thân nó lại là một list tham số).',
        'Dùng `discount_price(*args)` để "giải nén" list `args` thành các tham số vị trí riêng biệt cho `discount_price` (ví dụ `args = [100, 10]` thì gọi `discount_price(100, 10)`).',
        'So sánh kết quả với `expected` bằng `==`, thêm giá trị boolean đó (không phải chuyển đổi gì thêm) vào list kết quả trả về.',
      ],
      diagnostics: [
        { test: 'discount_price\\s*\\(\\s*args\\s*\\)(?!\\s*\\*)', message: 'Gọi `discount_price(args)` (truyền cả list làm MỘT tham số) sẽ sai vì hàm cần 2 tham số riêng biệt (`price`, `pct`). Dùng `discount_price(*args)` để giải nén list thành các tham số vị trí.' },
      ],
      approach: `
Bài này mô phỏng đúng bản chất của \`@pytest.mark.parametrize\`: MỘT logic test duy nhất, chạy lặp lại qua
NHIỀU bộ dữ liệu, mỗi bộ cho ra kết quả pass/fail độc lập.

\`\`\`python
def discount_price(price, pct):
    return round(price * (1 - pct / 100), 2)

def run_table_tests(cases):
    return [discount_price(*args) == expected for args, expected in cases]
\`\`\`

**Vì sao \`discount_price(*args)\` mà không phải \`discount_price(args)\`?** Toán tử \`*\` khi ĐẶT TRƯỚC một
list trong lời gọi hàm sẽ **giải nén (unpack)** list đó thành các tham số vị trí riêng biệt — \`*[100, 10]\`
tương đương viết tay \`100, 10\`. Nếu bỏ \`*\`, \`discount_price\` sẽ nhận NGUYÊN CẢ LIST làm giá trị của tham
số \`price\` duy nhất, thiếu mất tham số \`pct\`, gây lỗi \`TypeError\` ngay lập tức. Đây chính là cơ chế đứng
sau cách \`pytest.mark.parametrize\` "rải" từng dòng dữ liệu vào đúng các tham số của hàm test.
`,
      solution: `def discount_price(price, pct):
    return round(price * (1 - pct / 100), 2)

def run_table_tests(cases):
    return [discount_price(*args) == expected for args, expected in cases]`,
      complexity: {
        question: 'Độ phức tạp thời gian của `run_table_tests` theo số case n?',
        options: ['O(1)', 'O(n) — mỗi case được xử lý độc lập với chi phí không đổi, tổng công việc tuyến tính theo số case', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: 'Mỗi case chỉ cần một lần gọi hàm và một phép so sánh, chi phí không đổi cho mỗi case — tổng chi phí tỉ lệ thuận với số lượng case trong bảng.',
      },
      realWorld: 'Đây chính xác là cách CI pipeline chạy hàng trăm/nghìn test case cho cùng một hàm nghiệp vụ (ví dụ tính thuế, tính giá, validate định dạng) — một bảng dữ liệu lớn được liệt kê rõ ràng, dễ thêm case mới khi phát hiện bug ở edge case chưa từng nghĩ tới.',
    },
    {
      id: 'py-assert-almost-equal',
      title: 'So sánh số thực gần đúng (như pytest.approx)',
      en: 'Assert Almost Equal',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'assert_almost_equal',
      lang: 'python',
      statement: `
Viết hàm \`assert_almost_equal(a, b, tol=1e-9)\` mô phỏng đúng ý tưởng đứng sau \`pytest.approx\`: trả về
\`True\` nếu \`a\` và \`b\` **gần bằng nhau** (chênh lệch tuyệt đối không vượt quá \`tol\`), \`False\` nếu
không.

**Ví dụ**
- \`assert_almost_equal(0.1 + 0.2, 0.3)\` → \`True\` (dù \`0.1 + 0.2 == 0.3\` cho \`False\` do sai số float)
- \`assert_almost_equal(1.0, 1.1, 1e-4)\` → \`False\` (chênh lệch 0.1, vượt \`tol\`)
`,
      starter: `def assert_almost_equal(a, b, tol=1e-9):\n    # Tra ve True neu |a - b| <= tol\n    \n`,
      tests: [
        { args: [0.30000000000000004, 0.3], expected: true, name: 'Sai số float kinh điển của 0.1+0.2, dùng tol mặc định' },
        { args: [1.0, 1.0000001, 0.0001], expected: true, name: 'Chênh lệch nhỏ hơn tol' },
        { args: [1.0, 1.1, 0.0001], expected: false, name: 'Chênh lệch lớn hơn tol' },
        { args: [-0.0, 0.0, 1e-9], expected: true, name: '-0.0 và 0.0 coi là bằng nhau' },
        { args: [100000.0, 100000.0001, 0.000001], expected: false, name: 'Chênh lệch 0.0001 vượt tol rất nhỏ 1e-6' },
        { args: [5, 5, 0], expected: true, name: 'tol = 0, hai số bằng tuyệt đối nhau' },
      ],
      hints: [
        'Tính chênh lệch tuyệt đối bằng hàm dựng sẵn `abs(a - b)`.',
        'So sánh chênh lệch đó với `tol` bằng `<=` (nhỏ hơn HOẶC BẰNG — để trường hợp `tol = 0` với hai số bằng tuyệt đối vẫn trả về `True`).',
        'Toàn bộ hàm chỉ cần MỘT dòng: `return abs(a - b) <= tol`.',
      ],
      diagnostics: [
        { test: 'a\\s*==\\s*b(?!\\s*or)', message: 'So sánh `a == b` trực tiếp chính là thứ bài này muốn TRÁNH — với số thực, sai số làm tròn khiến hai giá trị "gần như bằng nhau về mặt toán học" vẫn có thể không bằng tuyệt đối. Hãy dùng `abs(a - b) <= tol`.' },
      ],
      approach: `
Bài này là bản viết tay đơn giản của \`pytest.approx\` — công cụ giải quyết đúng bẫy so sánh số thực đã học
ở phần lý thuyết.

\`\`\`python
def assert_almost_equal(a, b, tol=1e-9):
    return abs(a - b) <= tol
\`\`\`

**Vì sao \`0.1 + 0.2 == 0.3\` cho \`False\` trong Python (và hầu hết ngôn ngữ khác)?** Số thực trong máy tính
được lưu ở dạng nhị phân với độ chính xác GIỚI HẠN (chuẩn IEEE 754). Một số thập phân đơn giản như \`0.1\`
KHÔNG có biểu diễn nhị phân hữu hạn chính xác tuyệt đối — giống như \`1/3\` không viết được hết bằng số thập
phân hữu hạn. Kết quả, \`0.1 + 0.2\` cho ra một giá trị RẤT GẦN \`0.3\` nhưng khác đúng ở vài chữ số thập
phân cuối cùng (ví dụ \`0.30000000000000004\`). Đây KHÔNG phải bug của Python — đây là bản chất của số dấu
phẩy động trong MỌI ngôn ngữ lập trình phổ biến, và lý do "không bao giờ so sánh float bằng \`==\` tuyệt
đối" là một quy tắc phổ quát, không riêng gì Python.
`,
      solution: `def assert_almost_equal(a, b, tol=1e-9):
    return abs(a - b) <= tol`,
      complexity: {
        question: 'Độ phức tạp thời gian của `assert_almost_equal`?',
        options: ['O(1) — một phép trừ, một phép abs, một phép so sánh, không phụ thuộc kích thước input', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Toàn bộ hàm chỉ gồm các phép toán số học cơ bản trên hai số, không có vòng lặp hay phụ thuộc kích thước dữ liệu nào — chi phí hằng số tuyệt đối.',
      },
      realWorld: 'Test cho mọi hàm tính toán tài chính, khoa học, machine learning có liên quan tới số thực — từ tính lãi suất, tính khoảng cách GPS, tới so sánh trọng số mô hình sau khi train, đều cần so sánh "gần đúng" thay vì bằng tuyệt đối.',
    },
    {
      id: 'py-find-test-functions',
      title: 'Nhận diện hàm test theo quy ước pytest',
      en: 'Find Test Functions by Naming Convention',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'find_test_functions',
      lang: 'python',
      statement: `
Viết hàm \`find_test_functions(names)\` mô phỏng cơ chế **test discovery** của pytest: nhận một list tên hàm
(mô phỏng các hàm tìm thấy trong một file), trả về list các tên **được pytest coi là test case** — tức là
tên bắt đầu bằng \`"test_"\` — đã **sắp xếp theo thứ tự alphabet**.

**Ví dụ**
- \`find_test_functions(["test_add", "helper", "test_sub", "Config"])\` → \`["test_add", "test_sub"]\`
- \`find_test_functions(["test_zero_case", "setup_data", "test_add"])\` → \`["test_add", "test_zero_case"]\`
`,
      starter: `def find_test_functions(names):\n    # Tra ve cac ten bat dau bang "test_", da sap xep alphabet\n    \n`,
      tests: [
        { args: [['test_add', 'helper', 'test_sub', 'Config']], expected: ['test_add', 'test_sub'], name: 'Lọc và giữ nguyên thứ tự đã alphabet sẵn' },
        { args: [['test_zero_case', 'setup_data', 'test_add']], expected: ['test_add', 'test_zero_case'], name: 'Cần sắp xếp lại thứ tự alphabet' },
        { args: [[]], expected: [], name: 'Danh sách rỗng' },
        { args: [['helper', 'Config', 'setup']], expected: [], name: 'Không có tên nào thuộc quy ước test_' },
        { args: [['test_a', 'testing_b', 'test_c']], expected: ['test_a', 'test_c'], name: '"testing_b" KHÔNG khớp vì không có dấu gạch dưới ngay sau "test"' },
      ],
      hints: [
        'Dùng `.startswith("test_")` để kiểm tra một tên có đúng thuộc quy ước pytest hay không — chú ý: `"testing_b".startswith("test_")` trả về `False` vì ký tự ngay sau "test" là "i", không phải dấu gạch dưới "_".',
        'Lọc danh sách bằng list comprehension: `[n for n in names if n.startswith("test_")]`.',
        'Đừng quên `sorted(...)` kết quả đã lọc trước khi trả về — thứ tự alphabet là một phần yêu cầu của đề bài, không chỉ đơn thuần lọc.',
      ],
      diagnostics: [
        { test: '\\.find\\s*\\(\\s*[\'"]test', message: 'Dùng `.find("test")` sẽ khớp cả những tên có "test" xuất hiện ở BẤT KỲ ĐÂU trong chuỗi (kể cả không phải ở đầu, ví dụ "unittest_helper"), sai với quy ước thật của pytest (phải bắt đầu bằng "test_"). Hãy dùng `.startswith("test_")`.' },
      ],
      approach: `
Bài này mô phỏng đúng phần "quy ước đặt tên" quyết định việc pytest có tự động chạy một hàm hay không —
kiến thức nền tảng quan trọng nhất của cả module (một hàm sai tên sẽ bị bỏ qua ÂM THẦM, không cảnh báo).

\`\`\`python
def find_test_functions(names):
    matched = [n for n in names if n.startswith("test_")]
    return sorted(matched)
\`\`\`

**Vì sao kiểm tra đúng \`"test_"\` (có dấu gạch dưới) chứ không chỉ \`"test"\`?** Vì quy ước THẬT của pytest
yêu cầu sau "test" phải là dấu gạch dưới \`_\` rồi mới tới phần mô tả — một hàm tên \`testing_connection()\`
(không có gạch dưới ngay sau "test") **KHÔNG được pytest coi là test case**, dù trông có vẻ liên quan tới
việc "test". Đây chính xác là bẫy thực tế: đặt tên hàm hơi khác quy ước (thiếu gạch dưới, gõ nhầm
"tests_" thay vì "test_"...) khiến cả một hàm test không bao giờ được chạy, mà không có bất kỳ dấu hiệu lỗi
nào xuất hiện khi chạy \`pytest\`.
`,
      solution: `def find_test_functions(names):
    matched = [n for n in names if n.startswith("test_")]
    return sorted(matched)`,
      complexity: {
        question: 'Độ phức tạp thời gian của `find_test_functions` theo số tên n trong names?',
        options: ['O(1)', 'O(n log n) — lọc tốn O(n), nhưng sắp xếp kết quả tốn O(n log n), là bước chiếm ưu thế', 'O(n²)', 'O(2^n)'],
        answer: 1,
        why: 'Lọc danh sách bằng `startswith` tốn O(n) (duyệt qua mọi tên một lần). `sorted` trên kết quả đã lọc tốn O(n log n) — vì đây là bước có độ phức tạp cao hơn, nó quyết định độ phức tạp tổng của cả hàm.',
      },
      realWorld: 'Chính là cơ chế bên dưới lệnh `pytest` khi bạn chạy nó trong terminal: quét qua các file/module, lọc ra các hàm khớp quy ước đặt tên, rồi mới thực thi — hiểu rõ cơ chế này giúp debug nhanh tình huống "tôi viết test rồi mà sao pytest báo 0 test nào chạy".',
    },
  ],
},
];
