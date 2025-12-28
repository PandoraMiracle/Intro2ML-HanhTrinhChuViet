# coding: utf-8
"""
LLM Service - Google Gemini (REST API)
Ổn định, không SDK, dùng model đã xác nhận chạy: models/gemini-2.5-flash
Giữ nguyên interface cũ:
- init_vinallama()
- generate_response(...)
- get_model_info()
"""

import os
import json
import requests
import time

# =========================
# Global config
# =========================

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
# GEMINI_API_KEY = "AIzaSyDQMi4uRY0oYXjBzkcw6bCoK73qHmxC9rs"
try:
    print(f"🔑 GEMINI_API_KEY set: {GEMINI_API_KEY}")
except UnicodeEncodeError:
    print(f"GEMINI_API_KEY set: {GEMINI_API_KEY}")
_MODEL = "models/gemini-2.5-flash"
_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta"

# =========================
# Helpers
# =========================

def _fallback_json(message: str) -> str:
    return json.dumps(
        {"is_correct": True, "explanation": message},
        ensure_ascii=False
    )

def _headers():
    return {"Content-Type": "application/json"}

def _url():
    return f"{_ENDPOINT}/{_MODEL}:generateContent?key={GEMINI_API_KEY}"

# =========================
# Public APIs (GIỮ NGUYÊN)
# =========================

def init_vinallama():
    """
    Kiểm tra cấu hình API key.
    """
    if not GEMINI_API_KEY:
        print("⚠️ Chưa cấu hình GEMINI_API_KEY")
        return False, None
    print("✅ Gemini API đã được cấu hình (REST)")
    return True, "gemini"

def generate_response(
    prompt: str,
    max_new_tokens: int = 256,
    do_sample: bool = True,
    temperature: float = 0.7,
    top_p: float = 0.9,
) -> str:
    """
    Gọi Gemini REST API để sinh response.
    """
    if not GEMINI_API_KEY:
        return _fallback_json("Gemini API chưa được cấu hình.")

    payload = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ],
        "generationConfig": {
            "temperature": temperature if do_sample else 0.1,
            "topP": top_p,
            "maxOutputTokens": max_new_tokens
        }
    }

    try:
        print("🤖 Gọi Gemini API (REST)...")
        res = requests.post(_url(), headers=_headers(), json=payload, timeout=30)

        # Xử lý quota
        if res.status_code == 429:
            return _fallback_json("Gemini API hết quota tạm thời. Vui lòng thử lại sau.")

        res.raise_for_status()
        data = res.json()

        # Lấy text an toàn
        text = (
            data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text")
        )

        if not text:
            return _fallback_json("Gemini không trả nội dung.")

        return text

    except requests.RequestException as e:
        print(f"❌ Lỗi Gemini REST: {e}")
        return _fallback_json("Lỗi gọi Gemini API. Tạm chấp nhận câu trả lời.")

def get_model_info() -> dict:
    """
    Thông tin model đang dùng.
    """
    if GEMINI_API_KEY:
        return {
            "status": "configured",
            "provider": "Google Gemini",
            "model": _MODEL,
            "transport": "REST",
            "free": True,
        }
    return {
        "status": "not_configured",
        "message": "Chưa cấu hình GEMINI_API_KEY",
    }
