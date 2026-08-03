/**
 * LỘ TRÌNH PYTHON — MODULE 7: Xử lý ngoại lệ & Debugging
 */

export default [
/* ==================================================================== */
{
  id: 'py-exceptions',
  name: 'Xử lý ngoại lệ & Debugging',
  en: 'Exception Handling & Debugging',
  icon: '🚨',
  summary: 'try/except không chỉ là "try/catch đổi tên" — Python có triết lý riêng (EAFP), phân cấp exception rõ ràng, và những quy tắc thứ tự except dễ viết sai mà không báo lỗi ngay.',
  lesson: `
## 1. Vấn đề gốc

JavaScript và Python đều có try/catch(except), nhưng **triết lý sử dụng khác nhau**:

- JS (và nhiều ngôn ngữ khác) thường theo **LBYL — Look Before You Leap**: kiểm tra điều kiện TRƯỚC khi
  làm (\`if (obj && obj.prop) { ... }\`).
- Python khuyến khích **EAFP — Easier to Ask Forgiveness than Permission**: cứ làm luôn, nếu lỗi thì bắt
  exception. Đây không phải sở thích cá nhân — nó tránh được **race condition** (giữa lúc kiểm tra và lúc
  làm, trạng thái có thể đã đổi) và thường code gọn hơn.

\`\`\`python
# LBYL — kiểm tra trước (dễ có race condition, và tốn 1 lần truy cập thừa)
if key in my_dict:
    value = my_dict[key]
else:
    value = default

# EAFP — cứ lấy luôn, lỗi thì xử lý (Pythonic hơn)
try:
    value = my_dict[key]
except KeyError:
    value = default
\`\`\`

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Bắt lỗi | \`try { } catch (e) { }\` | \`try: ... except Exception as e: ...\` |
| Ném lỗi | \`throw new Error("msg")\` | \`raise ValueError("msg")\` |
| Luôn chạy dù có lỗi hay không | \`finally { }\` | \`finally:\` (giống hệt) |
| Chỉ chạy khi KHÔNG có lỗi | không có cú pháp riêng | \`else:\` (sau except, trước finally) |
| Custom error | \`class MyErr extends Error {}\` | \`class MyErr(Exception): pass\` |
| Lấy thông điệp lỗi | \`e.message\` | \`str(e)\` hoặc \`e.args\` |
| Bắt nhiều loại lỗi khác nhau | nhiều khối \`catch\` (một số ngôn ngữ), JS chỉ có 1 \`catch\` nên phải \`if (e instanceof X)\` | nhiều khối \`except TypeA:\`, \`except TypeB:\` RIÊNG BIỆT, hoặc gộp \`except (TypeA, TypeB):\` |

## 3. Ý tưởng cốt lõi

**(a) Exception có phân cấp (hierarchy)** — mọi exception "thường" kế thừa từ \`Exception\`, còn
\`Exception\` kế thừa từ \`BaseException\` (tổ tiên chung, bao gồm cả \`SystemExit\`, \`KeyboardInterrupt\` —
những thứ KHÔNG nên bị bắt nhầm). Vì vậy \`except Exception:\` là "bắt gần như mọi lỗi thường gặp" nhưng vẫn
để chương trình thoát được khi người dùng nhấn Ctrl+C. \`except:\` (bare, không ghi loại) bắt TẤT CẢ, kể cả
\`KeyboardInterrupt\` — gần như luôn là một lỗi thiết kế.

**(b) Thứ tự \`except\` quan trọng — con phải đứng trước cha.** Python kiểm tra từng khối \`except\` theo
thứ tự viết, dùng khối ĐẦU TIÊN khớp kiểu (hoặc kiểu cha của) exception xảy ra. Nếu đặt \`except Exception\`
lên trước \`except ValueError\`, khối \`ValueError\` sẽ **không bao giờ chạy được** (vì \`Exception\` đã "nuốt"
nó trước) — đây là lỗi logic, không phải lỗi cú pháp, nên rất khó nhận ra khi test.

**(c) \`raise\` không tham số bên trong khối \`except\` = re-raise, giữ nguyên traceback gốc.** Khác với
\`raise LoaiKhac("msg")\` (ném lỗi MỚI, mất traceback gốc — trừ khi dùng \`raise ... from e\` để "gắn chuỗi"
lỗi gốc vào lỗi mới, giúp debug biết nguyên nhân sâu xa).

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài | Nghĩ tới |
|---|---|
| "nếu không tìm thấy/không hợp lệ thì trả về None/giá trị mặc định" | try/except quanh thao tác, không phải if kiểm tra trước |
| "định nghĩa loại lỗi riêng cho ứng dụng" | custom exception class kế thừa \`Exception\` |
| "thử lại nếu thất bại" (retry) | vòng lặp with try/except, đếm số lần thử |
| "log lỗi nhưng vẫn tiếp tục chạy" | except cụ thể + \`else\`/\`finally\` để tách rõ luồng thành công/luôn chạy |
| "bỏ qua phần tử lỗi trong danh sách, giữ lại phần còn lại" | try/except NGAY BÊN TRONG vòng lặp, dùng \`continue\` |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
# (a) try/except/else/finally đầy đủ
try:
    result = risky_call()
except ValueError as e:
    print(f"Lỗi giá trị: {e}")
except (TypeError, KeyError) as e:      # bắt gộp nhiều loại
    print(f"Lỗi kiểu/khoá: {e}")
else:
    print("Chỉ chạy khi KHÔNG có lỗi:", result)
finally:
    print("Luôn chạy, dù có lỗi hay không — dùng để dọn dẹp tài nguyên")

# (b) Custom exception
class InsufficientFundsError(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(f"cần {amount}, hiện có {balance}")
    return balance - amount

# (c) Re-raise giữ traceback, và raise ... from ... để chain nguyên nhân
try:
    parse_config()
except ValueError as e:
    raise RuntimeError("Không đọc được config") from e   # traceback gốc vẫn hiện trong output

# (d) Bỏ qua phần tử lỗi, giữ phần còn lại
def parse_all(strs):
    out = []
    for s in strs:
        try:
            out.append(int(s))
        except ValueError:
            continue    # bỏ qua, không dừng cả vòng lặp
    return out
\`\`\`

## 6. Bẫy thường gặp

- **\`except Exception\` đặt TRƯỚC \`except ValueError\`**: khối \`ValueError\` phía sau sẽ không bao giờ chạy
  được vì \`Exception\` đã bắt trước — Python thậm chí còn cảnh báo (\`exceptions are never reached\`) ở một
  số linter, nhưng không phải lỗi runtime nên dễ lọt qua test thủ công.
- **\`except:\` trần (bare except) bắt cả \`KeyboardInterrupt\`/\`SystemExit\`**: khiến chương trình không thể
  bị dừng bằng Ctrl+C như mong đợi — luôn ghi rõ loại, tối thiểu là \`except Exception:\`.
- **Dùng exception để điều khiển luồng bình thường (không phải lỗi thật sự)**: ví dụ dùng
  \`try: return d[k] except KeyError: pass\` cho một thao tác XẢY RA THƯỜNG XUYÊN trong vòng lặp nóng (hot
  loop) — exception ở Python không "rẻ" bằng if thường, lạm dụng cho luồng bình thường (không phải trường
  hợp hiếm) làm chậm chương trình.
- **Quên rằng \`finally\` chạy TRƯỚC KHI hàm thực sự return**, kể cả khi \`try\`/\`except\` đã có \`return\`
  riêng — nếu \`finally\` cũng có \`return\`, nó sẽ GHI ĐÈ giá trị return của try/except (một bẫy tinh vi,
  nên tránh \`return\` bên trong \`finally\`).

## 7. Ứng dụng thực tế

- **Retry logic khi gọi API/database không ổn định**: bắt đúng loại lỗi tạm thời (timeout, connection
  reset), thử lại có giới hạn số lần, không bắt chung chung mọi lỗi (kẻo che giấu lỗi lập trình thật).
- **Custom exception hierarchy cho ứng dụng lớn**: định nghĩa \`AppError\` gốc, rồi \`ValidationError\`,
  \`PermissionError\` kế thừa từ đó — tầng gọi có thể bắt riêng từng loại, hoặc bắt gộp \`AppError\` khi chỉ
  cần biết "có lỗi nghiệp vụ xảy ra".
- **Parse dữ liệu từ nguồn không đáng tin (file người dùng upload, API bên thứ ba)**: bỏ qua từng dòng/phần
  tử lỗi thay vì crash toàn bộ tiến trình xử lý hàng loạt.
`,
  quiz: [
    {
      q: 'Vì sao thứ tự đặt các khối `except` trong Python lại quan trọng?',
      options: [
        'Không quan trọng, Python tự sắp xếp lại theo độ cụ thể',
        'Python kiểm tra các khối `except` THEO THỨ TỰ VIẾT và dùng khối đầu tiên khớp — nếu đặt `except Exception` (lớp cha) trước `except ValueError` (lớp con), khối `ValueError` sẽ không bao giờ được chạy tới',
        'Đặt sai thứ tự sẽ gây lỗi cú pháp ngay khi chạy chương trình',
        'Thứ tự chỉ ảnh hưởng tới hiệu năng, không ảnh hưởng logic',
      ],
      answer: 1,
      why: '`ValueError` là lớp con của `Exception`. Nếu `except Exception` đứng trước, nó sẽ bắt luôn mọi `ValueError` (vì ValueError CŨNG LÀ Exception), khiến khối `except ValueError` phía sau trở thành code chết (không bao giờ chạy) — đây là lỗi logic âm thầm, không phải lỗi cú pháp.',
    },
    {
      q: 'Bare `except:` (không ghi rõ loại exception) có vấn đề gì so với `except Exception:`?',
      options: [
        'Không có khác biệt nào, cả hai hoàn toàn tương đương',
        '`except:` bắt TẤT CẢ mọi thứ kế thừa từ `BaseException`, bao gồm cả `KeyboardInterrupt` và `SystemExit` — khiến chương trình không thể bị dừng bằng Ctrl+C hoặc `sys.exit()` như mong đợi',
        '`except:` chỉ hoạt động với các lỗi built-in, không bắt được custom exception',
        '`except:` chạy chậm hơn `except Exception:` nên nên tránh vì lý do hiệu năng',
      ],
      answer: 1,
      why: '`KeyboardInterrupt`/`SystemExit` kế thừa trực tiếp từ `BaseException`, KHÔNG kế thừa từ `Exception`. `except Exception:` chừa chúng lại để chương trình vẫn dừng được bình thường; bare `except:` nuốt luôn cả hai, gây khó chịu khi cần dừng chương trình thủ công.',
    },
    {
      q: 'Triết lý EAFP (Easier to Ask Forgiveness than Permission) trong Python nghĩa là gì?',
      options: [
        'Luôn kiểm tra điều kiện kỹ càng bằng `if` trước khi thực hiện thao tác',
        'Cứ thực hiện thao tác trước, nếu xảy ra lỗi thì bắt bằng try/except — tránh được race condition (trạng thái đổi giữa lúc kiểm tra và lúc làm) và thường code gọn hơn LBYL (Look Before You Leap)',
        'Không bao giờ dùng try/except, chỉ dùng if/else',
        'Chỉ áp dụng cho các phép toán số học, không áp dụng cho dict/list',
      ],
      answer: 1,
      why: 'EAFP là phong cách được cộng đồng Python khuyến khích: `try: value = d[k] except KeyError: value = default` thường được ưu tiên hơn `if k in d: ... else: ...` vì tránh phải truy cập/kiểm tra hai lần và tránh race condition trong môi trường đa luồng.',
    },
    {
      q: '`raise` (không kèm theo exception nào) được viết bên trong một khối `except` có tác dụng gì?',
      options: [
        'Gây lỗi cú pháp vì `raise` luôn cần một exception đi kèm',
        'Re-raise (ném lại) chính exception đang được xử lý, GIỮ NGUYÊN traceback gốc — khác với việc tạo và ném một exception mới',
        'Bỏ qua exception hiện tại và tiếp tục chạy như không có gì xảy ra',
        'Tương đương với `raise Exception()`  — luôn tạo ra lỗi kiểu Exception chung chung',
      ],
      answer: 1,
      why: '`raise` trần bên trong `except` ném lại CHÍNH exception đang bắt được, giữ nguyên traceback đầy đủ — hữu ích khi bạn muốn log/xử lý phụ rồi vẫn để lỗi lan lên tầng gọi phía trên, thay vì che giấu traceback gốc bằng một exception mới.',
    },
    {
      q: 'Đâu là lý do KHÔNG nên dùng try/except cho luồng điều khiển bình thường, xảy ra thường xuyên trong vòng lặp nóng (hot loop)?',
      options: [
        'Vì Python không cho phép đặt try/except bên trong vòng lặp',
        'Exception ở Python có chi phí tạo/xử lý cao hơn một phép kiểm tra `if` thông thường — dùng cho trường hợp XẢY RA THƯỜNG XUYÊN (không phải hiếm/ngoại lệ thật sự) sẽ làm chậm chương trình không cần thiết',
        'Vì try/except chỉ hoạt động đúng bên ngoài vòng lặp',
        'Không có lý do nào, dùng try/except ở đâu cũng như nhau về hiệu năng',
      ],
      answer: 1,
      why: 'Exception nên dành cho trường hợp thực sự "ngoại lệ" (hiếm, không mong đợi). Nếu một "lỗi" xảy ra RẤT THƯỜNG XUYÊN trong logic bình thường (ví dụ kiểm tra tồn tại), một câu `if` kiểm tra trước thường rẻ hơn về hiệu năng so với việc liên tục raise/catch exception trong vòng lặp lớn.',
    },
  ],
  problems: [
    {
      id: 'py-safe-divide',
      title: 'Chia an toàn',
      en: 'Safe Divide',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'safe_divide',
      lang: 'python',
      statement: `
Viết hàm \`safe_divide(a, b)\` trả về \`a / b\`. Nếu phép chia gây lỗi (chia cho 0, hoặc kiểu dữ liệu không
hợp lệ để chia), trả về \`None\` thay vì để chương trình crash.

**Ví dụ**
- \`safe_divide(10, 2)\` → \`5.0\`
- \`safe_divide(10, 0)\` → \`None\`
- \`safe_divide("10", 2)\` → \`None\` (chuỗi không chia được cho số)
`,
      starter: `def safe_divide(a, b):\n    # Tra ve a / b, hoac None neu gap loi (chia cho 0, sai kieu du lieu...)\n    \n`,
      tests: [
        { args: [10, 2], expected: 5.0, name: 'Chia hết cơ bản' },
        { args: [10, 0], expected: null, name: 'Chia cho 0 -> None' },
        { args: ['10', 2], expected: null, name: 'Sai kiểu dữ liệu -> None' },
        { args: [7, 2], expected: 3.5, name: 'Kết quả có phần thập phân' },
        { args: [-9, 3], expected: -3.0, name: 'Số âm' },
        { args: [0, 5], expected: 0.0, name: 'Tử số bằng 0' },
      ],
      hints: [
        'Bọc phép chia `a / b` trong `try:`. Có hai loại lỗi cần bắt: `ZeroDivisionError` (chia cho 0) và `TypeError` (kiểu dữ liệu không hỗ trợ phép chia, ví dụ chuỗi).',
        'Có thể bắt gộp nhiều loại lỗi trong MỘT khối bằng tuple: `except (ZeroDivisionError, TypeError):`.',
        'Đây là ví dụ EAFP kinh điển: cứ thử chia luôn, không cần `if not isinstance(...)` kiểm tra kiểu trước — để Python tự báo lỗi rồi bắt lại.',
      ],
      diagnostics: [
        { test: 'isinstance\\s*\\(', message: 'Bạn đang kiểm tra kiểu dữ liệu TRƯỚC khi chia (phong cách LBYL). Bài này luyện phong cách EAFP của Python: cứ thử chia trong `try`, bắt `ZeroDivisionError`/`TypeError` nếu có lỗi — gọn hơn và là quy ước Pythonic.' },
      ],
      approach: `
Đây là ví dụ rõ nhất cho **EAFP**: thay vì kiểm tra trước "b có phải 0 không", "a và b có phải số không",
ta cứ thực hiện phép chia và bắt đúng loại lỗi có thể xảy ra.

\`\`\`python
def safe_divide(a, b):
    try:
        return a / b
    except (ZeroDivisionError, TypeError):
        return None
\`\`\`

**Vì sao bắt cả hai loại lỗi trong MỘT khối \`except (A, B):\`** thay vì hai khối riêng? Vì cả hai trường hợp
đều dẫn tới cùng một hành động: trả về \`None\`. Chỉ nên tách thành nhiều khối \`except\` riêng khi mỗi loại
lỗi cần xử lý KHÁC NHAU (ví dụ log message khác nhau) — gộp lại khi hành động xử lý giống hệt nhau giúp code
ngắn gọn, tránh lặp lại.
`,
      solution: `def safe_divide(a, b):
    try:
        return a / b
    except (ZeroDivisionError, TypeError):
        return None`,
      complexity: {
        question: 'Độ phức tạp thời gian của `safe_divide`?',
        options: ['O(1) — một phép chia và tối đa một lần bắt lỗi, không phụ thuộc kích thước input', 'O(n) theo giá trị của a', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Phép chia là một thao tác hằng số, và cơ chế try/except không tạo thêm chi phí phụ thuộc kích thước dữ liệu — toàn bộ hàm chạy trong thời gian hằng số.',
      },
      realWorld: 'Tính tỉ lệ chuyển đổi (conversion rate), tỉ lệ phần trăm hoàn thành, trung bình cộng khi mẫu số có thể bằng 0 (chưa có dữ liệu) — trả `None` để tầng hiển thị biết "chưa tính được" thay vì để server crash vì `ZeroDivisionError` không bắt.',
    },
    {
      id: 'py-withdraw-custom-exception',
      title: 'Rút tiền với custom exception',
      en: 'Withdraw with Custom Exception',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'try_withdraw',
      lang: 'python',
      statement: `
Viết class \`InsufficientFundsError\` kế thừa \`Exception\`, và hai hàm:

1. \`withdraw(balance, amount)\`: nếu \`amount > balance\`, **raise** \`InsufficientFundsError\` với thông
   điệp đúng định dạng \`f"Số dư không đủ: cần {amount}, hiện có {balance}"\`. Ngược lại trả về
   \`balance - amount\`.
2. \`try_withdraw(balance, amount)\`: gọi \`withdraw\`, bắt \`InsufficientFundsError\` nếu có. Trả về:
   - \`("ok", số_dư_mới)\` nếu rút thành công
   - \`("error", thông_điệp_lỗi)\` nếu không đủ tiền (thông điệp lấy từ \`str(e)\`)

**Ví dụ**
- \`try_withdraw(100, 50)\` → \`("ok", 50)\`
- \`try_withdraw(100, 150)\` → \`("error", "Số dư không đủ: cần 150, hiện có 100")\`
`,
      starter: `class InsufficientFundsError(Exception):\n    pass\n\n\ndef withdraw(balance, amount):\n    # Neu amount > balance: raise InsufficientFundsError voi dung thong diep yeu cau\n    # Nguoc lai: tra ve balance - amount\n    \n\n\ndef try_withdraw(balance, amount):\n    # Goi withdraw(), bat InsufficientFundsError, tra ve tuple ("ok", ...) hoac ("error", ...)\n    \n`,
      tests: [
        { args: [100, 50], expected: ['ok', 50], name: 'Rút thành công, còn dư' },
        { args: [100, 100], expected: ['ok', 0], name: 'Rút đúng bằng số dư (biên)' },
        { args: [100, 150], expected: ['error', 'Số dư không đủ: cần 150, hiện có 100'], name: 'Rút vượt số dư' },
        { args: [0, 1], expected: ['error', 'Số dư không đủ: cần 1, hiện có 0'], name: 'Số dư bằng 0' },
        { args: [500, 0], expected: ['ok', 500], name: 'Rút 0 vẫn hợp lệ' },
      ],
      hints: [
        '`class InsufficientFundsError(Exception): pass` — kế thừa `Exception` là đủ, không cần override gì thêm cho bài này.',
        'Trong `withdraw`: `if amount > balance: raise InsufficientFundsError(f"Số dư không đủ: cần {amount}, hiện có {balance}")`. Chú ý giữ ĐÚNG format chuỗi (thứ tự "cần ... hiện có ...") vì bài kiểm tra so khớp chính xác thông điệp lỗi.',
        'Trong `try_withdraw`: `try: return ("ok", withdraw(balance, amount)) except InsufficientFundsError as e: return ("error", str(e))`.',
      ],
      diagnostics: [
        { test: 'except\\s+Exception', message: 'Bắt `except Exception` quá rộng ở đây — hãy bắt đúng `except InsufficientFundsError:` để không vô tình nuốt luôn các lỗi lập trình khác không liên quan tới nghiệp vụ rút tiền.' },
      ],
      approach: `
Bài này là mẫu chuẩn cho **custom exception trong ứng dụng thực tế**: tầng logic nghiệp vụ (\`withdraw\`)
\`raise\` một loại lỗi CÓ Ý NGHĨA NGHIỆP VỤ rõ ràng, còn tầng gọi (\`try_withdraw\`) quyết định cách hiển thị
lỗi đó ra ngoài (ở đây là tuple \`("error", message)\` thay vì để exception lan thẳng lên UI).

\`\`\`python
class InsufficientFundsError(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(f"Số dư không đủ: cần {amount}, hiện có {balance}")
    return balance - amount

def try_withdraw(balance, amount):
    try:
        return ("ok", withdraw(balance, amount))
    except InsufficientFundsError as e:
        return ("error", str(e))
\`\`\`

**Vì sao tách riêng \`withdraw\` (raise) và \`try_withdraw\` (catch)** thay vì gộp làm một hàm? Đây chính là
nguyên tắc thiết kế lỗi tốt: hàm xử lý nghiệp vụ CỨ RAISE khi gặp lỗi (không tự quyết định "trả về gì khi
lỗi"), còn tầng gọi ở NGOÀI CÙNG mới là nơi quyết định cách hiển thị/xử lý lỗi đó (tuple, log, thông báo UI,
retry...). Nếu gộp chung, mọi nơi gọi \`withdraw\` đều bị ép theo đúng một cách xử lý lỗi duy nhất.
`,
      solution: `class InsufficientFundsError(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(f"Số dư không đủ: cần {amount}, hiện có {balance}")
    return balance - amount

def try_withdraw(balance, amount):
    try:
        return ("ok", withdraw(balance, amount))
    except InsufficientFundsError as e:
        return ("error", str(e))`,
      complexity: {
        question: 'Độ phức tạp thời gian của `try_withdraw`?',
        options: ['O(1) — so sánh và một phép trừ, không phụ thuộc kích thước input', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Toàn bộ logic chỉ gồm một phép so sánh và một phép trừ (hoặc tạo một exception), đều là thao tác hằng số.',
      },
      realWorld: 'Hệ thống thanh toán/ví điện tử: lớp nghiệp vụ raise lỗi cụ thể (`InsufficientFundsError`, `AccountFrozenError`...), lớp API phía trên bắt và chuyển thành mã lỗi HTTP + message phù hợp cho client, tách bạch rõ "logic nghiệp vụ" khỏi "cách trình bày lỗi ra bên ngoài".',
    },
    {
      id: 'py-parse-int-list',
      title: 'Lọc và chuyển đổi danh sách số',
      en: 'Parse Int List, Skip Invalid',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'parse_int_list',
      lang: 'python',
      statement: `
Viết hàm \`parse_int_list(strs)\` nhận một list chuỗi, trả về list các số nguyên chuyển đổi thành công —
**bỏ qua** (không dừng chương trình) những chuỗi không thể chuyển thành số nguyên hợp lệ.

**Ví dụ**
- \`parse_int_list(["1", "2", "abc", "3"])\` → \`[1, 2, 3]\`
- \`parse_int_list(["1.5", "2"])\` → \`[2]\` (\`"1.5"\` không phải số nguyên hợp lệ, bị bỏ qua)
- \`parse_int_list([])\` → \`[]\`
`,
      starter: `def parse_int_list(strs):\n    # Tra ve list int chuyen doi thanh cong, bo qua chuoi loi\n    \n`,
      tests: [
        { args: [['1', '2', 'abc', '3']], expected: [1, 2, 3], name: 'Bỏ qua "abc"' },
        { args: [[]], expected: [], name: 'Danh sách rỗng' },
        { args: [['  4 ', '5']], expected: [4, 5], name: 'int() tự bỏ khoảng trắng thừa' },
        { args: [['1.5', '2']], expected: [2], name: '"1.5" không phải số nguyên hợp lệ -> bỏ qua' },
        { args: [['-3', 'x', '7']], expected: [-3, 7], name: 'Số âm, bỏ qua ký tự không hợp lệ' },
        { args: [['abc', 'def']], expected: [], name: 'Toàn chuỗi lỗi -> list rỗng' },
      ],
      hints: [
        'Duyệt qua từng chuỗi trong `strs`, thử `int(s)` bên trong `try`.',
        'Nếu `int(s)` gây lỗi (`ValueError`, ví dụ với "abc" hoặc "1.5"), dùng `except ValueError: continue` để bỏ qua phần tử đó và tiếp tục vòng lặp — KHÔNG dừng cả hàm.',
        'Chỉ những giá trị chuyển đổi thành công mới được `append` vào list kết quả.',
      ],
      diagnostics: [
        { test: 'if\\s+.*\\.isdigit\\s*\\(', message: 'Dùng `.isdigit()` để kiểm tra trước (LBYL) sẽ xử lý sai số âm (`"-3".isdigit()` trả về `False` dù `-3` là số nguyên hợp lệ). Hãy dùng phong cách EAFP: thử `int(s)` trong try/except `ValueError`.' },
      ],
      approach: `
Bài này luyện đúng mẫu **"bỏ qua phần tử lỗi, giữ phần còn lại"** — try/except đặt NGAY BÊN TRONG vòng lặp,
không phải bọc quanh cả vòng lặp (nếu bọc quanh cả vòng lặp, một phần tử lỗi sẽ làm dừng luôn toàn bộ,
không xử lý được các phần tử còn lại).

\`\`\`python
def parse_int_list(strs):
    result = []
    for s in strs:
        try:
            result.append(int(s))
        except ValueError:
            continue
    return result
\`\`\`

**Vì sao không dùng \`s.isdigit()\` để kiểm tra trước?** Vì \`"-3".isdigit()\` trả về \`False\` (dấu \`-\` không
phải chữ số), dù \`-3\` rõ ràng là số nguyên hợp lệ mà \`int("-3")\` chuyển đổi đúng — kiểm tra LBYL bằng
\`isdigit()\` ở đây SAI về mặt logic đối với số âm. Đây chính là lý do EAFP (\`int(s)\` rồi bắt lỗi) an toàn
hơn: nó dùng chính bộ chuyển đổi thật của Python để quyết định "hợp lệ hay không", không cần tự đoán bằng
một điều kiện có thể thiếu sót.
`,
      solution: `def parse_int_list(strs):
    result = []
    for s in strs:
        try:
            result.append(int(s))
        except ValueError:
            continue
    return result`,
      complexity: {
        question: 'Độ phức tạp thời gian của `parse_int_list` theo số phần tử n của strs?',
        options: ['O(1)', 'O(n) — duyệt qua từng chuỗi một lần, mỗi lần chuyển đổi tốn thời gian không đổi (bỏ qua độ dài chuỗi số)', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: 'Vòng lặp duyệt qua đúng n phần tử một lần, mỗi lần thực hiện một phép `int()` và (có thể) một lần bắt lỗi — cả hai đều là thao tác chi phí không đổi cho mỗi phần tử.',
      },
      realWorld: 'Xử lý file CSV/dữ liệu người dùng upload có thể chứa dòng lỗi định dạng: bỏ qua dòng hỏng, tiếp tục xử lý các dòng hợp lệ còn lại thay vì làm hỏng toàn bộ job import chỉ vì một dòng dữ liệu bẩn.',
    },
    {
      id: 'py-call-with-retry',
      title: 'Thử lại khi gặp lỗi (retry logic)',
      en: 'Call With Retry',
      difficulty: 'Hard',
      targetMinutes: 15,
      entry: 'call_with_retry',
      lang: 'python',
      statement: `
Viết hàm \`call_with_retry(operation, max_attempts)\`:
- Gọi \`operation()\` (không có tham số).
- Nếu \`operation()\` chạy thành công (không raise lỗi), trả về kết quả của nó **ngay lập tức**.
- Nếu \`operation()\` raise exception, **thử lại** (gọi lại \`operation()\`), tối đa \`max_attempts\` lần tổng
  cộng.
- Nếu **hết** \`max_attempts\` lần mà vẫn lỗi, để lỗi của **lần thử cuối cùng** tiếp tục lan ra ngoài (không
  nuốt lỗi).

**Ví dụ** (giả sử \`op\` thất bại 2 lần đầu, thành công lần thứ 3, trả về \`42\`):
- \`call_with_retry(op, 3)\` → gọi \`op()\` 3 lần, lần thứ 3 thành công → trả về \`42\`
- \`call_with_retry(op, 2)\` → gọi \`op()\` 2 lần, cả hai đều lỗi (vì \`op\` cần tới lần thứ 3 mới thành công)
  → **để lỗi lan ra ngoài**, không được tự trả về \`None\` hay nuốt lỗi âm thầm
`,
      starter: `def call_with_retry(operation, max_attempts):\n    # Goi operation() toi da max_attempts lan. Thanh cong -> tra ve ngay.\n    # Het luot ma van loi -> de loi cua lan cuoi lan ra ngoai (khong nuot loi).\n    \n`,
      tests: [
        { args: [0, 3], expected: 'ok:42', name: 'Không lỗi lần nào, thành công ngay' },
        { args: [2, 3], expected: 'ok:42', name: 'Lỗi 2 lần, thành công ở lần thử thứ 3 (vừa đủ)' },
        { args: [3, 3], expected: 'error:ValueError', name: 'Lỗi cả 3 lần (hết max_attempts) -> lỗi lan ra ngoài' },
        { args: [1, 5], expected: 'ok:42', name: 'Lỗi 1 lần, thành công lần 2, còn dư lượt' },
        { args: [5, 1], expected: 'error:ValueError', name: 'Chỉ được thử 1 lần, thất bại ngay' },
      ],
      hints: [
        'Dùng vòng lặp `for attempt in range(max_attempts):` bọc quanh lời gọi `operation()` trong `try`.',
        'Nếu `operation()` chạy thành công (không exception), `return` kết quả NGAY LẬP TỨC — dừng vòng lặp, không thử thêm.',
        'Nếu `operation()` raise lỗi: nếu đây là LẦN THỬ CUỐI CÙNG (`attempt == max_attempts - 1`), dùng `raise` (không tham số) để ném lại đúng lỗi đó ra ngoài; nếu chưa phải lần cuối, bắt lỗi và để vòng lặp tiếp tục sang lần thử kế tiếp.',
      ],
      diagnostics: [
        { test: 'except\\s*:\\s*\\n\\s*pass|except\\s*:\\s*\\n\\s*return\\s+None', message: 'Nuốt lỗi bằng `except: pass` hoặc `return None` khi hết lượt thử là SAI yêu cầu đề bài — sau khi hết `max_attempts` lần thử thất bại, lỗi của lần thử CUỐI phải được `raise` lại (lan ra ngoài), không được âm thầm trả về giá trị mặc định.' },
      ],
      approach: `
Đây là bài tổng hợp: vòng lặp + try/except + \`raise\` (re-raise có điều kiện) — mẫu retry logic dùng RẤT
nhiều trong thực tế khi gọi API/database không ổn định.

\`\`\`python
def call_with_retry(operation, max_attempts):
    for attempt in range(max_attempts):
        try:
            return operation()
        except Exception:
            if attempt == max_attempts - 1:   # đã là lần thử CUỐI CÙNG
                raise                          # để lỗi lan ra ngoài, không nuốt
            # nếu chưa phải lần cuối: không làm gì thêm, vòng lặp tự sang lần thử tiếp theo

\`\`\`

**Vì sao kiểm tra \`attempt == max_attempts - 1\` thay vì bắt lỗi rồi luôn \`raise\` ngay?** Vì mục tiêu của
hàm là THỬ LẠI khi còn lượt — chỉ khi ĐÃ HẾT lượt thử (đây là lần cuối cùng trong vòng lặp \`range\`) thì mới
để lỗi thực sự lan ra ngoài. Nếu luôn \`raise\` ngay ở lần lỗi đầu tiên, hàm sẽ không bao giờ thử lại được —
mất hết ý nghĩa "retry".
`,
      solution: `def call_with_retry(operation, max_attempts):
    for attempt in range(max_attempts):
        try:
            return operation()
        except Exception:
            if attempt == max_attempts - 1:
                raise`,
      harnessSrc: `def harness(fn, args, t):
    fail_times, max_attempts = args
    state = {'calls': 0}
    def operation():
        state['calls'] += 1
        if state['calls'] <= fail_times:
            raise ValueError(f"loi tam thoi lan {state['calls']}")
        return 42
    try:
        result = fn(operation, max_attempts)
        return f"ok:{result}"
    except Exception as e:
        return f"error:{type(e).__name__}"`,
      complexity: {
        question: 'Độ phức tạp thời gian của `call_with_retry` trong trường hợp XẤU NHẤT (luôn lỗi tới hết lượt), theo `max_attempts` (k) và chi phí mỗi lần gọi `operation()` là O(1)?',
        options: ['O(1) bất kể k', 'O(k) — trong trường hợp xấu nhất, `operation()` được gọi đúng k lần trước khi lỗi cuối cùng lan ra ngoài', 'O(k²)', 'O(2^k)'],
        answer: 1,
        why: 'Vòng lặp `for attempt in range(max_attempts)` chạy tối đa k lần, mỗi lần gọi operation() một lần — tổng chi phí tuyến tính theo số lượt thử tối đa.',
      },
      realWorld: 'Gọi API bên thứ ba, kết nối database, gửi message tới message queue — các thao tác I/O qua mạng có thể lỗi tạm thời (timeout, connection reset); retry với giới hạn số lần giúp hệ thống tự phục hồi khỏi lỗi thoáng qua mà không cần can thiệp thủ công, đồng thời vẫn báo lỗi thật nếu vấn đề kéo dài (không lỗi tạm thời).',
    },
  ],
},
];
