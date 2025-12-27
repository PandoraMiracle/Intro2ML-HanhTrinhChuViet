from flask import Blueprint, jsonify, request
from PIL import Image
import io

from ..services.vietocr_service import run_vietocr

ocr_bp = Blueprint("ocr", __name__)


@ocr_bp.get("/")
def home():
    return "Welcome to the Python OCR Server! (VietOCR)"


@ocr_bp.post("/predict")
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image part in the request"}), 400

    file = request.files["image"]

    try:
        img_bytes = file.read()
        pil_img = Image.open(io.BytesIO(img_bytes))

        # Fallback VietOCR (Vietnamese printed)
        ocr_text = run_vietocr(pil_img)
        model_used = "vietocr_fallback"

        return jsonify({
            "message": "OK",
            "model_used": model_used,
            "ocr_text": ocr_text,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
