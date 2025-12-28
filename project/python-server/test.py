import requests
import os
import json

API_KEY = os.getenv("GEMINI_API_KEY")

url = (
    "https://generativelanguage.googleapis.com/v1beta/"
    "models/gemini-2.5-flash:generateContent"
    f"?key={API_KEY}"
)

payload = {
    "contents": [
        {
            "parts": [
                {"text": "Hello Gemini, trả lời OK nếu bạn nhận được"}
            ]
        }
    ]
}

res = requests.post(url, json=payload, timeout=30)

print(res.status_code)
print(res.text)
