# coding: utf-8
"""
Practice Service - Xử lý câu hỏi điền khuyết cho ứng dụng học tiếng Việt
"""
import csv
import random
import re
import json
import unicodedata
from pathlib import Path
from typing import List, Dict, Optional, Tuple

from .vinallama_service import generate_response, init_vinallama

# =========================
# JSON rescue parser (QUAN TRỌNG)
# =========================

def robust_json_loads(text: str):
    """
    Parse JSON an toàn từ LLM output:
    - bỏ ```json
    - chịu được output bị cắt
    """
    if not text:
        raise ValueError("Empty LLM response")

    s = text.strip()

    # 1) Bỏ code fence
    s = re.sub(r"^\s*```(?:json)?\s*", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\s*```\s*$", "", s)

    # 2) Tìm JSON bắt đầu từ [ hoặc {
    start_candidates = [i for i in (s.find("["), s.find("{")) if i != -1]
    if not start_candidates:
        raise json.JSONDecodeError("No JSON found", s, 0)

    s = s[min(start_candidates):].strip()

    # 3) Thử parse trực tiếp
    try:
        return json.loads(s)
    except json.JSONDecodeError:
        pass

    # 4) Nếu bị cắt, cắt tới dấu đóng ngoặc cuối cùng
    last = max(s.rfind("]"), s.rfind("}"))
    if last != -1:
        return json.loads(s[: last + 1])

    raise


# =========================
# Dữ liệu
# =========================

CSV_PATH = Path(__file__).parent.parent.parent.parent / "server" / "uploads" / "ca_dao_tuc_ngu_dien_khuyet.csv"

DAILY_LIFE_QUESTIONS = [
    "Hôm nay trời ____",
    "Tôi đang ____ cơm",
    "Buổi sáng tôi thường ____ lúc 6 giờ",
    "Mẹ tôi nấu ____ rất ngon",
    "Con mèo đang ____ trên ghế",
    "Em bé đang ____ sữa",
    "Bố tôi đi ____ mỗi ngày",
    "Tôi thích ____ sách",
    "Chúng tôi đang ____ bài",
    "Anh ấy ____ tiếng Việt rất giỏi",
    "Cô giáo đang ____ bài",
    "Các bạn đang ____ bóng đá",
    "Trời đang ____ mưa",
    "Tôi muốn ____ nước",
    "Bạn tôi ____ rất vui vẻ",
    "Chị ấy ____ áo đẹp",
    "Ông bà tôi ____ ở quê",
    "Hôm qua tôi ____ phim hay",
    "Ngày mai tôi sẽ ____ học",
    "Con chó đang ____ ngoài sân",
]


# =========================
# Utils
# =========================

def remove_vietnamese_diacritics(text: str) -> str:
    nfkd_form = unicodedata.normalize('NFD', text)
    only_ascii = ''.join(c for c in nfkd_form if not unicodedata.combining(c))
    replacements = {
        'đ': 'd', 'Đ': 'D',
        'ă': 'a', 'Ă': 'A',
        'â': 'a', 'Â': 'A',
        'ê': 'e', 'Ê': 'E',
        'ô': 'o', 'Ô': 'O',
        'ơ': 'o', 'Ơ': 'O',
        'ư': 'u', 'Ư': 'U',
    }
    for viet, ascii_char in replacements.items():
        only_ascii = only_ascii.replace(viet, ascii_char)
    return only_ascii


def normalize_answer(answer: str) -> str:
    if not answer:
        return ""
    normalized = answer.lower().strip()
    normalized = re.sub(r'\s+', ' ', normalized)
    return normalized


# =========================
# CSV + question generation
# =========================

def load_ca_dao_from_csv() -> List[Dict]:
    ca_dao_list = []
    try:
        with open(CSV_PATH, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                ca_dao_list.append({
                    "cau_trong": row.get("cau_trong", ""),
                    "dap_an": row.get("dap_an", ""),
                    "cau_goc": row.get("cau_goc", "")
                })
    except Exception as e:
        print(f"❌ Lỗi đọc CSV: {e}")
    return ca_dao_list


def get_random_ca_dao(count: int = 5) -> List[Dict]:
    all_ca_dao = load_ca_dao_from_csv()
    return random.sample(all_ca_dao, min(count, len(all_ca_dao)))


def get_random_daily_life(count: int = 5) -> List[str]:
    return random.sample(DAILY_LIFE_QUESTIONS, min(count, len(DAILY_LIFE_QUESTIONS)))


def generate_practice_questions() -> List[Dict]:
    questions = []

    ca_dao_items = get_random_ca_dao(5)
    for i, item in enumerate(ca_dao_items, start=1):
        questions.append({
            "id": i,
            "type": "ca_dao",
            "question": item["cau_trong"],
            "answer": item["dap_an"],
            "original": item["cau_goc"]
        })

    daily_items = get_random_daily_life(5)
    for i, q in enumerate(daily_items, start=6):
        questions.append({
            "id": i,
            "type": "doi_thuong",
            "question": q
        })

    random.shuffle(questions)
    for i, q in enumerate(questions, start=1):
        q["id"] = i

    return questions


# =========================
# Check answers
# =========================

def check_ca_dao_answer(correct_answer: str, user_answer: str, strict: bool = False) -> Tuple[bool, str]:
    normalized_correct = normalize_answer(correct_answer)
    normalized_user = normalize_answer(user_answer)

    if normalized_user == normalized_correct:
        return True, f"Chính xác! Đáp án đúng là \"{correct_answer}\"."

    if not strict:
        if remove_vietnamese_diacritics(normalized_user) == remove_vietnamese_diacritics(normalized_correct):
            return True, f"Đúng! Đáp án là \"{correct_answer}\". (Lưu ý: bạn nên viết đúng dấu)"

    return False, f"Sai rồi! Đáp án đúng là \"{correct_answer}\"."


# =========================
# 🔥 FIX CHÍNH Ở ĐÂY
# =========================

def check_daily_life_answers_batch_with_llm(questions_data: List[Dict]) -> List[Dict]:
    if not questions_data:
        return []

    questions_text = ""
    for idx, item in enumerate(questions_data, start=1):
        questions_text += f'{idx}. "{item["question"]}" | Trả lời: "{item["user_answer"]}"\n'

    prompt = f"""Chỉ trả về JSON hợp lệ.
KHÔNG dùng ```json```.
KHÔNG giải thích ngoài JSON.

Danh sách câu hỏi:
{questions_text}

JSON array format:
[
  {{"id": 1, "is_correct": true/false, "explanation": "giải thích ngắn"}},
  ...
]
"""

    try:
        print("🔍 DEBUG: Gọi LLM batch", flush=True)

        response = generate_response(
            prompt=prompt,
            max_new_tokens=2048,   # 🔥 tăng token
            do_sample=False,
            temperature=0.1
        )

        print(f"🤖 LLM Batch Response: {response}", flush=True)

        results = robust_json_loads(response)

        result_map = {r["id"]: r for r in results if "id" in r}

        final_results = []
        for item in questions_data:
            item_id = item["id"]
            r = result_map.get(item_id)
            if r:
                final_results.append({
                    "id": item_id,
                    "is_correct": bool(r.get("is_correct", True)),
                    "explanation": r.get("explanation", "Câu trả lời phù hợp.")
                })
            else:
                final_results.append({
                    "id": item_id,
                    "is_correct": True,
                    "explanation": "Câu trả lời có thể chấp nhận."
                })

        return final_results

    except Exception as e:
        print(f"❌ Lỗi batch LLM: {e}", flush=True)
        return [
            {
                "id": item["id"],
                "is_correct": True,
                "explanation": "Không thể đánh giá. Tạm chấp nhận."
            }
            for item in questions_data
        ]


def check_daily_life_answer_with_llm(question: str, user_answer: str) -> Tuple[bool, str]:
    results = check_daily_life_answers_batch_with_llm([
        {"id": 1, "question": question, "user_answer": user_answer}
    ])
    if results:
        return results[0]["is_correct"], results[0]["explanation"]
    return True, "Không thể xác nhận. Tạm chấp nhận."


def check_answer(question_type: str, question: str, user_answer: str,
                 correct_answer: Optional[str] = None) -> Dict:
    if not user_answer or not user_answer.strip():
        return {"is_correct": False, "explanation": "Bạn chưa nhập câu trả lời."}

    if question_type == "ca_dao":
        is_correct, explanation = check_ca_dao_answer(correct_answer, user_answer)
        return {"is_correct": is_correct, "explanation": explanation, "correct_answer": correct_answer}

    if question_type == "doi_thuong":
        is_correct, explanation = check_daily_life_answer_with_llm(question, user_answer)
        return {"is_correct": is_correct, "explanation": explanation}

    return {"is_correct": False, "explanation": "Loại câu hỏi không hợp lệ."}
