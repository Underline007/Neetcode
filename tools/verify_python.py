"""
Chạy lời giải mẫu Python của mọi bài tập qua toàn bộ test case.

Không gọi trực tiếp — hãy chạy: node tools/verify-python.mjs
(script Node đọc dữ liệu bài tập rồi đẩy JSON vào stdin của file này).

Ngữ nghĩa chấm bài ở đây phải KHỚP với src/sandbox.worker.py.js (bộ chấm thật chạy
CPython qua Pyodide trong trình duyệt): cùng cách dựng harness/checker, cùng deep_equal,
cùng việc đưa args qua JSON. Sửa một bên thì phải sửa bên kia.
"""

import json
import math
import sys


def deep_equal(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return a is b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        try:
            if math.isnan(a) and math.isnan(b):
                return True
        except TypeError:
            pass
        return abs(a - b) < 1e-9
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        if len(a) != len(b):
            return False
        return all(deep_equal(x, y) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        if set(a.keys()) != set(b.keys()):
            return False
        return all(deep_equal(a[k], b[k]) for k in a)
    return a == b


def make_callable(src, user_globals, name):
    if not src:
        return None
    try:
        return eval(src, user_globals)
    except SyntaxError:
        ns = dict(user_globals)
        exec(src, ns)
        return ns[name]


def preview(value, max_len=200):
    try:
        s = json.dumps(value, ensure_ascii=False, default=str)
    except Exception:
        s = str(value)
    return s if len(s) <= max_len else s[:max_len] + ' …'


def run_problem(p):
    """Trả về danh sách thông báo lỗi (rỗng = bài đạt)."""
    errors = []
    user_globals = {}
    try:
        exec(p['solution'], user_globals)
    except Exception as e:
        return [f"lời giải không chạy được — {type(e).__name__}: {e}"]

    fn = user_globals.get(p['entry'])
    if not callable(fn):
        return [f"lời giải không định nghĩa \"{p['entry']}\""]

    try:
        harness = make_callable(p.get('harnessSrc'), user_globals, 'harness') \
            or (lambda f, args, t: f(*args))
        checker = make_callable(p.get('checkerSrc'), user_globals, 'checker')
    except Exception as e:
        return [f"harness/checker lỗi — {type(e).__name__}: {e}"]

    for t in p['tests']:
        args = json.loads(json.dumps(t.get('args')))
        try:
            got = harness(fn, args, t)
            expected = t.get('expected')
            ok = bool(checker(got, expected, t.get('args'))) if checker \
                else deep_equal(got, expected)
            if not ok:
                errors.append(
                    f"test \"{t.get('name')}\"\n"
                    f"       args : {preview(t.get('args'))}\n"
                    f"       nhận : {preview(got)}\n"
                    f"       mong : {preview(expected)}"
                )
        except Exception as e:
            errors.append(f"test \"{t.get('name')}\" — {type(e).__name__}: {e}")
    return errors


def main():
    payload = json.load(sys.stdin)
    problems = payload['problems']
    failed_problems = 0
    total_tests = 0
    out = []

    for p in problems:
        total_tests += len(p['tests'])
        errors = run_problem(p)
        if errors:
            failed_problems += 1
            out.append(f"❌ {p['id']}")
            out.extend('   ' + e for e in errors)

    print('\n'.join(out))
    print(f"Python: {len(problems)} bài · {total_tests} test · "
          f"{failed_problems} bài KHÔNG đạt")
    sys.exit(1 if failed_problems else 0)


if __name__ == '__main__':
    main()
