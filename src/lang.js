/**
 * Cơ chế song ngữ: một chủ đề/bài tập thuật toán có thể mang cả nội dung JS (gốc, các
 * field thường) và Python (field cùng tên + hậu tố "Py") trên CÙNG một object, thay vì
 * tách thành hai object riêng. Bài thuộc track Python thuần tuý (module ngôn ngữ) chỉ có
 * field gốc (đã là Python), không cần hậu tố Py.
 */

/** Lấy field theo ngôn ngữ: nếu lang='python' và có field `${base}Py` thì dùng field đó,
 *  ngược lại dùng field gốc (fallback tự nhiên khi bài chưa có bản Python, hoặc khi object
 *  vốn thuộc track Python nên field gốc đã là Python sẵn). */
export function pick(obj, base, lang) {
  if (lang === 'python') {
    const py = obj[`${base}Py`];
    if (py !== undefined) return py;
  }
  return obj[base];
}

/** Ngôn ngữ thực tế nên dùng để hiển thị & chấm 1 bài tập, dựa trên công tắc hiện tại
 *  và việc bài đó đã có bản Python hay chưa. */
export function resolveLang(problem, switchLang) {
  if (problem.lang === 'python') return 'python';
  if (switchLang === 'python' && problem.starterPy) return 'python';
  return 'javascript';
}

/** Chủ đề đã sẵn sàng hiển thị bằng Python chưa (thuộc track Python thuần tuý, hoặc đã
 *  được dịch trọn vẹn: có lessonPy). Quy ước: một chủ đề chỉ được coi là "sẵn sàng" khi
 *  TOÀN BỘ bài tập bên trong đã có starterPy — chuyển đổi theo nguyên khối, không dở dang. */
export function topicHasPython(t) {
  return t.lang === 'python' || !!t.lessonPy;
}
