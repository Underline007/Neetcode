/**
 * BÀI LUYỆN CÚ PHÁP ("drill") — bổ sung cho từng module Python.
 *
 * Vì sao tách riêng khỏi part*.js? Vì đây là một mạch nội dung khác: part*.js chứa bài tập
 * theo kịch bản công việc, còn ở đây mỗi bài nhắm đúng MỘT điểm cú pháp vừa học trong mục
 * "📖 Cú pháp cần biết trước" của module đó, đề ngắn, làm trong vài phút. Mỗi module có 4
 * bài xếp từ dễ đến khó: 2 bài luyện cú pháp thuần → 1 bài vừa → 1 bài khó hơn có kịch bản.
 *
 * index.js ghép các bài này vào đầu danh sách bài tập của module rồi xếp lại theo độ khó.
 */

import { DRILLS_1_5 } from './drills1.js';
import { DRILLS_6_10 } from './drills2.js';
import { DRILLS_11_15 } from './drills3.js';

/** { [topicId]: Problem[] } */
export const PY_DRILLS = { ...DRILLS_1_5, ...DRILLS_6_10, ...DRILLS_11_15 };
