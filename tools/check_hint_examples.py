"""Chạy THẬT mọi ví dụ trong từ điển cú pháp và so với kết quả đã ghi.

Ví dụ là phần người mới tin nhất, nên nó không được phép sai. Mỗi ví dụ có dạng
`code → kết quả`: ở đây ta chạy phần code bằng CPython rồi so `repr(giá trị)` với
phần kết quả. Câu cuối của code là biểu thức cần lấy giá trị; các câu trước (gán,
import) chỉ để dựng bối cảnh.

Đầu vào (stdin, JSON): {"cases": [{"id", "code", "expected", "setup"}]}
Đầu ra (stdout, JSON): [{"id", "ok", "got"|"error"}]
"""
import ast
import json
import sys


def run_case(case):
    ns = {}
    if case.get("setup"):
        exec(case["setup"], ns)

    tree = ast.parse(case["code"])
    if not tree.body:
        raise ValueError("ví dụ không có code")

    last = tree.body[-1]
    if tree.body[:-1]:
        exec(compile(ast.Module(body=tree.body[:-1], type_ignores=[]), "<vd>", "exec"), ns)

    if isinstance(last, ast.Expr):
        value = eval(compile(ast.Expression(body=last.value), "<vd>", "eval"), ns)
        return repr(value)

    # Câu cuối là câu lệnh (gán, gọi hàm không lấy giá trị...) -> ví dụ phải ghi
    # kết quả là <không trả giá trị>, hoặc ghi tiếp một biểu thức để xem kết quả.
    exec(compile(ast.Module(body=[last], type_ignores=[]), "<vd>", "exec"), ns)
    return "<không trả giá trị>"


payload = json.loads(sys.stdin.read())
out = []
for case in payload["cases"]:
    try:
        out.append({"id": case["id"], "ok": True, "got": run_case(case)})
    except Exception as e:  # noqa: BLE001 - lỗi nào cũng phải báo về, không được dừng
        out.append({"id": case["id"], "ok": False, "error": f"{type(e).__name__}: {e}"})

print(json.dumps(out, ensure_ascii=False))
