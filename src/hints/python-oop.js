/**
 * Từ điển cú pháp Python — lớp & dataclass, iterator/generator/decorator, OOP nâng cao,
 * type hints. Tương ứng module 4, 5, 11, 14 của lộ trình Python.
 */
import { entry as e, tag } from './item.js';

/* ==================== 🏗️ LỚP & DATACLASS ==================== */
const OOP = tag('oop', [
  e('class', 'kw', 'class Tên:',
    'Định nghĩa một lớp — khuôn để tạo ra các object cùng loại.', {
      insert: 'class $|:\n    def __init__(self):\n        ',
      ex: ['class A:\n    x = 1\nA().x → 1'],
      alias: 'lop, doi tuong',
    }),
  e('self', 'kw', 'def method(self):',
    'Chính object đang gọi phương thức. Luôn là tham số ĐẦU TIÊN, và Python tự truyền vào giúp.', {
      ex: ['class A:\n    def __init__(self): self.n = 5\n    def lay(self): return self.n\nA().lay() → 5'],
      alias: 'this, ban than',
    }),
  e('__init__', 'm', 'def __init__(self, ...):',
    'Hàm khởi tạo, chạy ngay khi tạo object. Chỗ để gán các thuộc tính ban đầu.', {
      insert: 'def __init__(self$|):\n        ',
      ex: ['class P:\n    def __init__(self, x): self.x = x\nP(3).x → 3'],
      alias: 'constructor, khoi tao',
    }),
  e('__repr__', 'm', 'def __repr__(self) -> str:',
    'Chuỗi mô tả object khi in trong list hoặc gõ tên object ra. Nên viết dạng gọi lại được.', {
      insert: 'def __repr__(self):\n        return f"$|"',
      ex: ['class P:\n    def __repr__(self): return "P(1)"\n[P()] → [P(1)]'],
      alias: 'in ra object, tostring',
    }),
  e('__str__', 'm', 'def __str__(self) -> str:',
    'Chuỗi thân thiện cho người đọc, dùng bởi print() và str(). Không có thì Python lấy __repr__.', {
      insert: 'def __str__(self):\n        return f"$|"',
      ex: ['class P:\n    def __str__(self): return "diem"\nstr(P()) → \'diem\''],
    }),
  e('__eq__', 'm', 'def __eq__(self, other) -> bool:',
    'Quyết định dấu == so sánh hai object thế nào. Không định nghĩa thì == chỉ đúng khi là cùng một object.', {
      insert: 'def __eq__(self, other):\n        return isinstance(other, type(self)) and $|',
      ex: ['class P:\n    def __init__(self, x): self.x = x\n    def __eq__(self, o): return self.x == o.x\nP(1) == P(1) → True'],
      alias: 'so sanh bang',
    }),
  e('__hash__', 'm', 'def __hash__(self):',
    'Cho phép object làm khoá của dict/phần tử của set. Định nghĩa __eq__ mà quên cái này là object hết băm được.', {
      insert: 'def __hash__(self):\n        return hash(($|,))',
      ex: ['class P:\n    def __init__(self, x): self.x = x\n    def __eq__(self, o): return self.x == o.x\n    def __hash__(self): return hash(self.x)\nlen({P(1), P(1)}) → 1'],
    }),
  e('__lt__', 'm', 'def __lt__(self, other) -> bool:',
    'Định nghĩa dấu <, nhờ đó sorted()/min()/max() làm việc được với object của bạn.', {
      insert: 'def __lt__(self, other):\n        return $|',
      ex: ['class P:\n    def __init__(self, x): self.x = x\n    def __lt__(self, o): return self.x < o.x\nmin([P(3), P(1)]).x → 1'],
      alias: 'so sanh nho hon, sap xep object',
    }),
  e('__len__', 'm', 'def __len__(self) -> int:',
    'Cho phép gọi len(object). Trả về số nguyên không âm.', {
      insert: 'def __len__(self):\n        return $|',
      ex: ['class Gio:\n    def __len__(self): return 3\nlen(Gio()) → 3'],
    }),
  e('super', 'fn', 'super().__init__(...)',
    'Gọi phương thức của lớp cha — dùng nhiều nhất trong __init__ của lớp con.', {
      insert: 'super().$|',
      ex: ['class A:\n    def ten(self): return "A"\nclass B(A):\n    def ten(self): return super().ten() + "B"\nB().ten() → \'AB\''],
      alias: 'lop cha, ke thua',
    }),
  e('kế thừa', 'snip', 'class Con(Cha):',
    'Lớp con nhận hết thuộc tính và phương thức của lớp cha, muốn đổi thì viết lại phương thức đó.', {
      insert: 'class $|(Cha):\n    ',
      ex: ['class A:\n    def f(self): return 1\nclass B(A): pass\nB().f() → 1'],
    }),
  e('@property', 'kw', '@property\\ndef ten(self):',
    'Biến một phương thức thành thuộc tính đọc được như biến — gọi không cần dấu ngoặc.', {
      insert: '@property\ndef $|(self):\n        return ',
      ex: ['class C:\n    def __init__(self): self.r = 2\n    @property\n    def dt(self): return self.r * 2\nC().dt → 4'],
      alias: 'getter, thuoc tinh tinh toan',
    }),
  e('setter', 'snip', '@ten.setter\\ndef ten(self, v):',
    'Cho phép gán vào một property, thường kèm kiểm tra giá trị trước khi nhận.', {
      insert: '@$|.setter\ndef (self, v):\n        ',
      ex: ['class C:\n    @property\n    def x(self): return self._x\n    @x.setter\n    def x(self, v): self._x = abs(v)\nc = C(); c.x = -5; c.x → 5'],
    }),
  e('@staticmethod', 'kw', '@staticmethod\\ndef f(a):',
    'Hàm nằm trong lớp cho gọn nhưng không cần self — như một hàm phụ trợ có địa chỉ rõ ràng.', {
      insert: '@staticmethod\ndef $|():\n        ',
      ex: ['class M:\n    @staticmethod\n    def cong(a, b): return a + b\nM.cong(2, 3) → 5'],
    }),
  e('@classmethod', 'kw', '@classmethod\\ndef tao(cls, ...):',
    'Phương thức nhận chính LỚP làm tham số đầu. Hay dùng làm cách tạo object thứ hai.', {
      insert: '@classmethod\ndef $|(cls):\n        return cls()',
      ex: ['class P:\n    def __init__(self, x): self.x = x\n    @classmethod\n    def goc(cls): return cls(0)\nP.goc().x → 0'],
      alias: 'factory, tao object',
    }),
  e('@dataclass', 'mod', '@dataclass\\nclass Điểm:\\n    x: int',
    'Tự sinh __init__, __repr__, __eq__ từ danh sách thuộc tính — đỡ phải viết tay.', {
      setup: 'from dataclasses import dataclass, field',
      insert: '@dataclass\nclass $|:\n    ',
      ex: ['@dataclass\nclass P:\n    x: int\n    y: int = 0\nP(1) → P(x=1, y=0)', '@dataclass\nclass P:\n    x: int\nP(1) == P(1) → True'],
      alias: 'lop du lieu, dataclass',
    }),
  e('field', 'mod', 'field(default_factory=list)',
    'Khai báo mặc định cho thuộc tính dataclass là list/dict rỗng. Không được viết = [] trực tiếp vì mọi object sẽ dùng chung.', {
      setup: 'from dataclasses import dataclass, field',
      ex: ['@dataclass\nclass G:\n    ds: list = field(default_factory=list)\nG().ds → []'],
    }),
  e('frozen=True', 'snip', '@dataclass(frozen=True)',
    'Dataclass bất biến: gán lại thuộc tính sẽ báo lỗi, và object băm được nên dùng làm khoá dict.', {
      setup: 'from dataclasses import dataclass',
      insert: '@dataclass(frozen=True)\nclass $|:\n    ',
      ex: ['@dataclass(frozen=True)\nclass P:\n    x: int\nlen({P(1), P(1)}) → 1'],
    }),
  e('order=True', 'snip', '@dataclass(order=True)',
    'Sinh luôn các phép so sánh <, >, so theo thứ tự thuộc tính đã khai báo.', {
      setup: 'from dataclasses import dataclass',
      insert: '@dataclass(order=True)\nclass $|:\n    ',
      ex: ['@dataclass(order=True)\nclass P:\n    x: int\nsorted([P(2), P(1)]) → [P(x=1), P(x=2)]'],
    }),
  e('asdict', 'mod', 'asdict(obj)',
    'Đổi một dataclass thành dict — tiện khi cần ghi ra JSON.', {
      setup: 'from dataclasses import dataclass, asdict',
      ex: ['@dataclass\nclass P:\n    x: int\nasdict(P(1)) → {\'x\': 1}'],
    }),
  e('__slots__', 'kw', '__slots__ = ("x", "y")',
    'Cố định danh sách thuộc tính; object nhẹ hơn và nhanh hơn, nhưng không thêm được thuộc tính mới.', {
      ex: ['class P:\n    __slots__ = ("x",)\n    def __init__(self): self.x = 1\nP().x → 1'],
      alias: 'tiet kiem bo nho',
    }),
]);

/* ============ 🌀 ITERATOR, GENERATOR & DECORATOR ============ */
const FUNCTIONAL = tag('functional', [
  e('iter', 'fn', 'iter(dãy)',
    'Lấy "con trỏ đọc" của một dãy. Vòng for thực chất luôn làm việc này giúp bạn.', {
      ex: ['it = iter([1, 2]); next(it) → 1'],
    }),
  e('next', 'fn', 'next(it) | next(it, mặc_định)',
    'Lấy phần tử kế tiếp. Hết phần tử thì báo StopIteration, trừ khi có giá trị mặc định.', {
      ex: ['it = iter([1]); next(it) → 1', 'it = iter([]); next(it, "het") → \'het\'',
        'next(x for x in [1, 5, 8] if x > 3) → 5'],
      alias: 'phan tu tiep theo',
    }),
  e('yield', 'kw', 'yield giá_trị',
    'Trả một giá trị rồi TẠM DỪNG hàm tại đó; lần gọi kế tiếp chạy tiếp từ chỗ dừng. Hàm có yield là generator.', {
      insert: 'yield $|',
      ex: ['def dem():\n    yield 1\n    yield 2\nlist(dem()) → [1, 2]'],
      alias: 'generator, sinh gia tri',
    }),
  e('yield from', 'kw', 'yield from dãy',
    'Nhả lại toàn bộ giá trị của một dãy/generator khác, khỏi phải viết vòng lặp.', {
      ex: ['def g():\n    yield from [1, 2]\n    yield 3\nlist(g()) → [1, 2, 3]'],
    }),
  e('generator expression', 'snip', '(f(x) for x in dãy)',
    'Như list comprehension nhưng không dựng cả list trong bộ nhớ — tính tới đâu dùng tới đó.', {
      insert: '($| for x in )',
      ex: ['sum(x * x for x in range(4)) → 14', 'max(len(w) for w in ["ab", "cde"]) → 3'],
      alias: 'generator gon, tiet kiem bo nho',
    }),
  e('StopIteration', 'kw', 'raise StopIteration',
    'Lỗi báo "hết phần tử". Vòng for tự bắt lỗi này để biết lúc nào dừng.', {
      ex: ['it = iter([])\ntry:\n    next(it)\nexcept StopIteration:\n    r = "het"\nr → \'het\''],
    }),
  e('__iter__', 'm', 'def __iter__(self):',
    'Cho phép dùng object của bạn trong vòng for. Thường trả về iter(...) của dữ liệu bên trong.', {
      insert: 'def __iter__(self):\n        return iter($|)',
      ex: ['class Bo:\n    def __iter__(self): return iter([1, 2])\nlist(Bo()) → [1, 2]'],
    }),
  e('__next__', 'm', 'def __next__(self):',
    'Cùng với __iter__ làm nên một iterator tự viết: mỗi lần gọi trả một phần tử.', {
      insert: 'def __next__(self):\n        $|',
      ex: ['class Mot:\n    def __iter__(self): return self\n    def __next__(self): raise StopIteration\nlist(Mot()) → []'],
    }),
  e('decorator', 'snip', '@ten_decorator\\ndef f(): ...',
    'Bọc thêm việc quanh một hàm (đếm, đo thời gian, kiểm tra quyền) mà không sửa thân hàm.', {
      insert: '@$|\ndef ():\n    ',
      ex: ['def gap_doi(f):\n    def trong(*a): return f(*a) * 2\n    return trong\n@gap_doi\ndef mot(): return 1\nmot() → 2'],
      alias: 'trang tri, bao ham',
    }),
  e('@wraps', 'mod', '@wraps(func)',
    'Giữ lại tên và docstring của hàm gốc khi viết decorator — không có nó thì mọi hàm đều tên là "wrapper".', {
      setup: 'from functools import wraps',
      ex: ['def d(f):\n    @wraps(f)\n    def w(): return f()\n    return w\n@d\ndef chao(): pass\nchao.__name__ → \'chao\''],
    }),
  e('lru_cache', 'mod', '@lru_cache(maxsize=None)',
    'Ghi nhớ kết quả theo tham số: gọi lại với tham số cũ thì lấy ngay. Biến đệ quy chậm thành nhanh.', {
      setup: 'from functools import lru_cache',
      ex: ['@lru_cache(maxsize=None)\ndef fib(n): return n if n < 2 else fib(n-1) + fib(n-2)\nfib(30) → 832040'],
      alias: 'memo, ghi nho ket qua',
    }),
  e('cache', 'mod', '@cache',
    'Bản viết gọn của @lru_cache(maxsize=None), có từ Python 3.9.', {
      setup: 'from functools import cache',
      ex: ['@cache\ndef f(n): return n * 2\nf(3) → 6'],
    }),
  e('partial', 'mod', 'partial(hàm, tham_số_cố_định)',
    'Tạo hàm mới từ hàm cũ với một số tham số đã điền trước.', {
      setup: 'from functools import partial',
      ex: ['nhan2 = partial(pow, 2); nhan2(10) → 1024', 'partial(int, base=2)("101") → 5'],
    }),
  e('reduce', 'mod', 'reduce(hàm, dãy, khởi_đầu)',
    'Gộp cả dãy về một giá trị bằng cách áp dụng hàm hai-tham-số liên tiếp.', {
      setup: 'from functools import reduce',
      ex: ['reduce(lambda a, b: a * b, [1, 2, 3, 4]) → 24', 'reduce(lambda a, b: a + b, [1, 2], 10) → 13'],
    }),
  e('chain', 'mod', 'chain(a, b, ...)',
    'Nối nhiều dãy lại thành một dãy để duyệt liền mạch, không tạo list mới.', {
      setup: 'from itertools import chain',
      ex: ['list(chain([1], [2, 3])) → [1, 2, 3]', 'list(chain.from_iterable([[1], [2]])) → [1, 2]'],
      alias: 'noi day, lam phang',
    }),
  e('islice', 'mod', 'islice(dãy, stop) | islice(dãy, start, stop)',
    'Cắt lát cho generator (thứ không cắt bằng dấu [] được).', {
      setup: 'from itertools import islice, count',
      ex: ['list(islice(count(), 3)) → [0, 1, 2]', 'list(islice([1, 2, 3, 4], 1, 3)) → [2, 3]'],
    }),
  e('groupby', 'mod', 'groupby(dãy_đã_sắp, key=hàm)',
    'Gom các phần tử LIỀN KỀ có cùng khoá. Phải sắp xếp trước, nếu không sẽ ra nhiều nhóm rời rạc.', {
      setup: 'from itertools import groupby',
      ex: ['[(k, len(list(g))) for k, g in groupby("aabb")] → [(\'a\', 2), (\'b\', 2)]'],
      alias: 'gom nhom lien ke',
    }),
  e('count', 'mod', 'count(start=0, step=1)',
    'Đếm vô hạn — phải tự dừng bằng break hoặc islice.', {
      setup: 'from itertools import count, islice',
      ex: ['list(islice(count(10, 5), 3)) → [10, 15, 20]'],
    }),
  e('cycle', 'mod', 'cycle(dãy)',
    'Lặp lại dãy vô hạn lần, dùng cho việc chia lượt xoay vòng.', {
      setup: 'from itertools import cycle, islice',
      ex: ['list(islice(cycle("ab"), 5)) → [\'a\', \'b\', \'a\', \'b\', \'a\']'],
    }),
  e('zip_longest', 'mod', 'zip_longest(a, b, fillvalue=None)',
    'Như zip nhưng chạy tới dãy DÀI nhất, chỗ thiếu điền giá trị bù.', {
      setup: 'from itertools import zip_longest',
      ex: ['list(zip_longest([1, 2], "a", fillvalue="-")) → [(1, \'a\'), (2, \'-\')]'],
    }),
  e('accumulate', 'mod', 'accumulate(dãy)',
    'Tổng tích luỹ (prefix sum): mỗi phần tử là tổng của chính nó và mọi phần tử trước.', {
      setup: 'from itertools import accumulate',
      ex: ['list(accumulate([1, 2, 3])) → [1, 3, 6]'],
      alias: 'tong tien to, prefix sum',
    }),
  e('combinations', 'mod', 'combinations(dãy, r)',
    'Mọi cách chọn r phần tử KHÔNG quan tâm thứ tự.', {
      setup: 'from itertools import combinations',
      ex: ['list(combinations("abc", 2)) → [(\'a\', \'b\'), (\'a\', \'c\'), (\'b\', \'c\')]'],
      alias: 'to hop',
    }),
  e('permutations', 'mod', 'permutations(dãy, r=None)',
    'Mọi cách xếp thứ tự — có quan tâm thứ tự, nên nhiều hơn combinations.', {
      setup: 'from itertools import permutations',
      ex: ['len(list(permutations("abc"))) → 6', 'list(permutations("ab")) → [(\'a\', \'b\'), (\'b\', \'a\')]'],
      alias: 'hoan vi',
    }),
  e('product', 'mod', 'product(a, b) | product(dãy, repeat=n)',
    'Tích Descartes — thay cho các vòng lặp lồng nhau.', {
      setup: 'from itertools import product',
      ex: ['list(product([1, 2], "a")) → [(1, \'a\'), (2, \'a\')]', 'len(list(product("01", repeat=3))) → 8'],
    }),
]);

/* ==================== 🧬 OOP NÂNG CAO & DUNDER ==================== */
const ADVOOP = tag('advoop', [
  e('__call__', 'm', 'def __call__(self, ...):',
    'Cho phép gọi object như gọi hàm: obj(...). Dùng khi object cần vừa nhớ trạng thái vừa hành động.', {
      insert: 'def __call__(self$|):\n        ',
      ex: ['class Nhan:\n    def __init__(self, k): self.k = k\n    def __call__(self, x): return x * self.k\nNhan(3)(5) → 15'],
    }),
  e('__getitem__', 'm', 'def __getitem__(self, i):',
    'Cho phép viết obj[i]. Có thêm __len__ là dùng được cả vòng for.', {
      insert: 'def __getitem__(self, i):\n        return $|',
      ex: ['class B:\n    def __getitem__(self, i): return i * 2\nB()[4] → 8'],
    }),
  e('__setitem__', 'm', 'def __setitem__(self, i, v):',
    'Cho phép gán obj[i] = v — cặp đôi của __getitem__ khi object hoạt động như một bảng.', {
      insert: 'def __setitem__(self, i, v):\n        $|',
      ex: ['class B:\n    def __init__(self): self.d = {}\n    def __setitem__(self, k, v): self.d[k] = v\nb = B(); b["x"] = 1; b.d → {\'x\': 1}'],
    }),
  e('__contains__', 'm', 'def __contains__(self, x):',
    'Quyết định phép "x in obj" trả về gì.', {
      insert: 'def __contains__(self, x):\n        return $|',
      ex: ['class T:\n    def __contains__(self, x): return x == 1\n1 in T() → True'],
    }),
  e('__add__', 'm', 'def __add__(self, other):',
    'Định nghĩa dấu + cho object. Các phép khác: __sub__, __mul__, __truediv__.', {
      insert: 'def __add__(self, other):\n        return $|',
      ex: ['class V:\n    def __init__(self, x): self.x = x\n    def __add__(self, o): return V(self.x + o.x)\n(V(1) + V(2)).x → 3'],
      alias: 'nap chong toan tu, operator overload',
    }),
  e('__bool__', 'm', 'def __bool__(self):',
    'Quyết định object được coi là đúng hay sai trong if. Không có thì mọi object đều là đúng.', {
      insert: 'def __bool__(self):\n        return $|',
      ex: ['class R:\n    def __bool__(self): return False\nbool(R()) → False'],
    }),
  e('__getattr__', 'm', 'def __getattr__(self, ten):',
    'Chạy khi truy cập một thuộc tính KHÔNG tồn tại — dùng để tạo thuộc tính động hoặc báo lỗi rõ hơn.', {
      insert: 'def __getattr__(self, ten):\n        $|',
      ex: ['class A:\n    def __getattr__(self, t): return "khong co " + t\nA().abc → \'khong co abc\''],
    }),
  e('ABC', 'mod', 'class Nền(ABC):',
    'Lớp trừu tượng: không tạo object trực tiếp được, chỉ để lớp con kế thừa và cài đặt.', {
      setup: 'from abc import ABC, abstractmethod',
      ex: ['class N(ABC):\n    @abstractmethod\n    def f(self): ...\nclass C(N):\n    def f(self): return 1\nC().f() → 1'],
      alias: 'lop truu tuong, abstract',
    }),
  e('abstractmethod', 'mod', '@abstractmethod\\ndef f(self): ...',
    'Bắt buộc lớp con phải cài đặt phương thức này, nếu không thì không tạo được object.', {
      setup: 'from abc import ABC, abstractmethod',
      insert: '@abstractmethod\ndef $|(self):\n        ...',
      ex: ['class N(ABC):\n    @abstractmethod\n    def f(self): ...\ntry:\n    N()\nexcept TypeError:\n    r = "khong tao duoc"\nr → \'khong tao duoc\''],
    }),
  e('total_ordering', 'mod', '@total_ordering',
    'Có __eq__ và __lt__ rồi thì decorator này tự suy ra <=, >, >= — đỡ viết bốn phương thức.', {
      setup: 'from functools import total_ordering',
      ex: ['@total_ordering\nclass P:\n    def __init__(self, x): self.x = x\n    def __eq__(self, o): return self.x == o.x\n    def __lt__(self, o): return self.x < o.x\nP(1) <= P(2) → True'],
    }),
  e('__mro__', 'kw', 'Lớp.__mro__',
    'Thứ tự Python đi tìm phương thức qua các lớp cha — cần khi kế thừa nhiều lớp mà bị gọi sai hàm.', {
      ex: ['class A: pass\nclass B(A): pass\n[c.__name__ for c in B.__mro__] → [\'B\', \'A\', \'object\']'],
      alias: 'thu tu ke thua',
    }),
  e('issubclass', 'fn', 'issubclass(Con, Cha)',
    'Kiểm tra quan hệ kế thừa giữa hai LỚP (còn isinstance là giữa object và lớp).', {
      ex: ['issubclass(bool, int) → True', 'issubclass(int, str) → False'],
    }),
  e('getattr', 'fn', 'getattr(obj, "tên", mặc_định)',
    'Lấy thuộc tính theo TÊN dạng chuỗi, không có thì trả mặc định thay vì lỗi.', {
      ex: ['class A:\n    x = 1\ngetattr(A(), "x") → 1', 'getattr(object(), "abc", 0) → 0'],
    }),
  e('setattr', 'fn', 'setattr(obj, "tên", giá_trị)',
    'Gán thuộc tính mà tên chỉ biết lúc chạy.', {
      ex: ['class A: pass\na = A(); setattr(a, "x", 5); a.x → 5'],
    }),
  e('hasattr', 'fn', 'hasattr(obj, "tên")',
    'Object có thuộc tính/phương thức đó không.', {
      ex: ['hasattr([], "append") → True', 'hasattr(1, "append") → False'],
    }),
  e('__dict__', 'kw', 'obj.__dict__',
    'Dict chứa toàn bộ thuộc tính của một object — tiện để xem object đang giữ những gì.', {
      ex: ['class A:\n    def __init__(self): self.x = 1\nA().__dict__ → {\'x\': 1}'],
    }),
]);

/* ==================== 🏷️ TYPE HINTS ==================== */
const TYPING = tag('typing', [
  e('->', 'kw', 'def f(x: int) -> str:',
    'Ghi chú kiểu: sau dấu hai chấm là kiểu tham số, sau -> là kiểu trả về. Python KHÔNG kiểm tra lúc chạy.', {
      ex: ['def f(x: int) -> str: return str(x)\nf(3) → \'3\'', 'def f(x: int) -> str: ...\nf.__annotations__["return"] → <class \'str\'>'],
      alias: 'kieu tra ve, annotation',
    }),
  e('list[int]', 'kw', 'list[int] | dict[str, int] | tuple[int, ...]',
    'Kiểu có nội dung: list toàn số nguyên, dict khoá chuỗi giá trị số. Viết chữ thường, từ Python 3.9.', {
      ex: ['def f(xs: list[int]) -> int: return sum(xs)\nf([1, 2]) → 3'],
      alias: 'kieu long nhau, generic',
    }),
  e('Optional', 'mod', 'Optional[int]',
    'Có thể là kiểu đó HOẶC None. Cách viết mới tương đương: int | None.', {
      setup: 'from typing import Optional',
      ex: ['def f(x: Optional[int] = None) -> int: return x or 0\nf() → 0'],
      alias: 'co the None',
    }),
  e('Union', 'mod', 'Union[int, str] | int | str',
    'Một trong nhiều kiểu. Từ Python 3.10 viết gọn bằng dấu |.', {
      setup: 'from typing import Union',
      ex: ['def f(x: Union[int, str]) -> str: return str(x)\nf(1) → \'1\''],
    }),
  e('Any', 'mod', 'Any',
    'Kiểu gì cũng được — dùng khi thật sự không xác định được, đừng dùng vì cho tiện.', {
      setup: 'from typing import Any',
      ex: ['def f(x: Any) -> bool: return bool(x)\nf([]) → False'],
    }),
  e('Callable', 'mod', 'Callable[[int], str]',
    'Kiểu của một hàm: trong ngoặc vuông là kiểu tham số, sau đó là kiểu trả về.', {
      setup: 'from typing import Callable',
      ex: ['def ap(f: Callable[[int], int], x: int) -> int: return f(x)\nap(lambda n: n + 1, 4) → 5'],
    }),
  e('Iterable', 'mod', 'Iterable[int]',
    'Bất cứ thứ gì duyệt được bằng for (list, tuple, set, generator). Nên dùng cho tham số vì rộng hơn list.', {
      setup: 'from typing import Iterable',
      ex: ['def tong(xs: Iterable[int]) -> int: return sum(xs)\ntong(range(4)) → 6'],
    }),
  e('Sequence', 'mod', 'Sequence[int]',
    'Dãy có thứ tự và lấy được theo chỉ số (list, tuple, str) nhưng không cần sửa được.', {
      setup: 'from typing import Sequence',
      ex: ['def dau(xs: Sequence[int]) -> int: return xs[0]\ndau((7, 8)) → 7'],
    }),
  e('TypeVar', 'mod', 'T = TypeVar("T")',
    'Kiểu "chưa biết nhưng nhất quán": hàm nhận T thì trả về T, dùng cho hàm dùng chung nhiều kiểu.', {
      setup: 'from typing import TypeVar',
      ex: ['T = TypeVar("T")\ndef dau(xs: list[T]) -> T: return xs[0]\ndau(["a"]) → \'a\''],
    }),
  e('Protocol', 'mod', 'class Có_len(Protocol):',
    'Mô tả kiểu theo "có phương thức gì" chứ không theo kế thừa — kiểm tra kiểu kiểu vịt nhưng có tên.', {
      setup: 'from typing import Protocol',
      ex: ['class CoTen(Protocol):\n    def ten(self) -> str: ...\nclass A:\n    def ten(self): return "a"\nisinstance(A(), object) → True'],
    }),
  e('NamedTuple', 'mod', 'class Điểm(NamedTuple):\\n    x: int',
    'Tuple có tên trường kèm kiểu — nhẹ, bất biến, dùng ngay được như tuple.', {
      setup: 'from typing import NamedTuple',
      ex: ['class P(NamedTuple):\n    x: int\n    y: int = 0\nP(1) → P(x=1, y=0)', 'class P(NamedTuple):\n    x: int\nP(1)[0] → 1'],
    }),
  e('TypedDict', 'mod', 'class Người(TypedDict):\\n    ten: str',
    'Mô tả hình dạng của một dict: khoá nào, giá trị kiểu gì. Lúc chạy vẫn là dict thường.', {
      setup: 'from typing import TypedDict',
      ex: ['class N(TypedDict):\n    ten: str\nn: N = {"ten": "an"}\nn["ten"] → \'an\''],
    }),
  e('Literal', 'mod', 'Literal["asc", "desc"]',
    'Chỉ nhận đúng những giá trị liệt kê ra — thay cho việc truyền chuỗi tuỳ ý.', {
      setup: 'from typing import Literal',
      ex: ['def sx(h: Literal["asc", "desc"]) -> bool: return h == "asc"\nsx("asc") → True'],
    }),
  e('Final', 'mod', 'MAX: Final = 100',
    'Đánh dấu hằng số không được gán lại. Công cụ kiểm kiểu sẽ cảnh báo nếu bạn gán lại.', {
      setup: 'from typing import Final',
      ex: ['MAX: Final = 100\nMAX + 1 → 101'],
    }),
  e('cast', 'mod', 'cast(int, x)',
    'Nói với công cụ kiểm kiểu "chỗ này chắc chắn là kiểu đó". Không đổi giá trị lúc chạy.', {
      setup: 'from typing import cast',
      ex: ['cast(int, "5") → \'5\''],
    }),
]);

export default [...OOP, ...FUNCTIONAL, ...ADVOOP, ...TYPING];
