"""Chạy phần ĐO HIỆU NĂNG của driver Python bằng CPython trên máy.

Driver được truyền vào qua stdin — chính là chuỗi DRIVER_SRC lấy từ
src/sandbox.worker.py.js (xem tools/test-bench-python.mjs), nên đây là bài kiểm
tra ĐÚNG đoạn mã chạy trong trình duyệt, không phải một bản chép lại.

Đầu vào (stdin, JSON):
    {"driver": "...", "cases": [{"name","code","refCode","entry","tests","harnessSrc"}]}
Đầu ra (stdout, JSON): [{"name", "result": <kết quả của __neetcode_bench>}]
"""
import json
import sys

payload = json.loads(sys.stdin.read())

driver_ns = {}
exec(payload["driver"], driver_ns)
bench = driver_ns["__neetcode_bench"]

out = []
for case in payload["cases"]:
    raw = bench(
        case["code"],
        case["refCode"],
        case["entry"],
        json.dumps(case["tests"]),
        case.get("harnessSrc"),
    )
    out.append({"name": case["name"], "result": json.loads(raw)})

# Dòng print này cũng là một phép thử: trong lúc đo, driver vô hiệu hoá print()
# của người học. Nếu nó không trả print về nguyên trạng thì ở đây sẽ không in ra
# gì cả và phía Node sẽ báo lỗi "không đọc được kết quả".
print(json.dumps(out, ensure_ascii=False))
