from flask import Flask, request, jsonify
from PIL import Image
import io

import numpy as np
import cv2

# PaddleOCR
from paddleocr import PaddleOCR

# VietOCR (Vietnamese printed text)
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg

# TrOCR fallback (handwritten; not Vietnamese-optimized)
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

app = Flask(__name__)

# =============================
#  Helpers
# =============================
def ensure_white_bg(pil_img: Image.Image) -> Image.Image:
    """
    Canvas hay gửi PNG RGBA (nền trong suốt). Convert RGB thẳng sẽ ra nền đen -> OCR fail.
    Ép nền trắng.
    """
    if pil_img.mode in ("RGBA", "LA"):
        bg = Image.new("RGBA", pil_img.size, (255, 255, 255, 255))
        pil_img = Image.alpha_composite(bg, pil_img.convert("RGBA")).convert("RGB")
    else:
        pil_img = pil_img.convert("RGB")
    return pil_img


def crop_to_ink(pil_img: Image.Image, pad: int = 20) -> Image.Image:
    """
    Crop sát vùng có nét (không trắng) để tránh ảnh quá trống khiến OCR đoán bừa.
    """
    pil_img = ensure_white_bg(pil_img)
    gray = np.array(pil_img.convert("L"))

    mask = gray < 245
    if not mask.any():
        return pil_img

    ys, xs = np.where(mask)
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()

    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(gray.shape[1] - 1, x1 + pad)
    y1 = min(gray.shape[0] - 1, y1 + pad)

    return pil_img.crop((x0, y0, x1 + 1, y1 + 1))


def preprocess_for_paddle(pil_img: Image.Image) -> np.ndarray:
    """
    Chuẩn hoá ảnh cho PaddleOCR:
    - ép nền trắng
    - crop sát chữ
    - tăng tương phản nhẹ (CLAHE)
    - chuyển BGR (OpenCV)
    """
    pil_img = crop_to_ink(pil_img, pad=25)
    rgb = np.array(pil_img)

    lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l2 = clahe.apply(l)
    lab2 = cv2.merge([l2, a, b])
    rgb2 = cv2.cvtColor(lab2, cv2.COLOR_LAB2RGB)

    bgr = cv2.cvtColor(rgb2, cv2.COLOR_RGB2BGR)
    return bgr


def preprocess_for_vietocr(pil_img: Image.Image) -> Image.Image:
    """
    Preprocess cho VietOCR (chữ in tiếng Việt):
    - ép nền trắng
    - crop sát chữ
    - upscale nhẹ cho nét canvas/ảnh nhỏ
    """
    pil_img = crop_to_ink(pil_img, pad=25).convert("RGB")

    # upscale nếu ảnh nhỏ (giúp nhận dạng tốt hơn)
    w, h = pil_img.size
    if max(w, h) < 800:
        pil_img = pil_img.resize((w * 2, h * 2), Image.BICUBIC)

    return pil_img


def preprocess_for_trocr(pil_img: Image.Image) -> Image.Image:
    """
    Preprocess cho TrOCR (handwritten):
    - ép nền trắng
    - crop sát chữ
    - Otsu threshold
    - dilate nhẹ
    - trả về RGB
    """
    pil_img = crop_to_ink(pil_img, pad=30)
    gray = np.array(pil_img.convert("L"))

    _, th = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    th = cv2.dilate(th, np.ones((2, 2), np.uint8), iterations=1)
    th = 255 - th  # chữ đen nền trắng

    return Image.fromarray(th).convert("RGB")


# =============================
#  Load models (1 lần)
# =============================
# PaddleOCR: detect + recog (Vietnamese)
paddle = PaddleOCR(
    lang="vi",
    use_textline_orientation=True
)

device = "cuda" if torch.cuda.is_available() else "cpu"

# VietOCR: Vietnamese printed text recognizer
vietocr_cfg = Cfg.load_config_from_name("vgg_transformer")
vietocr_cfg["device"] = device
vietocr_cfg["predictor"]["beamsearch"] = False
vietocr = Predictor(vietocr_cfg)

# TrOCR: handwritten fallback (not Vietnamese-optimized)
trocr_processor = TrOCRProcessor.from_pretrained(
    "microsoft/trocr-base-handwritten",
    use_fast=True
)
trocr_model = VisionEncoderDecoderModel.from_pretrained(
    "microsoft/trocr-base-handwritten"
).to(device)
trocr_model.eval()


def run_vietocr(pil_img: Image.Image) -> str:
    img = preprocess_for_vietocr(pil_img)
    text = vietocr.predict(img)
    return (text or "").strip()


def run_trocr(pil_img: Image.Image) -> str:
    img = preprocess_for_trocr(pil_img)
    pixel_values = trocr_processor(images=img, return_tensors="pt").pixel_values.to(device)

    with torch.no_grad():
        generated_ids = trocr_model.generate(pixel_values, max_length=32)

    text = trocr_processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return (text or "").strip()


# =============================
#  Routes
# =============================
@app.route("/")
def home():
    return "Welcome to the Python OCR Server! (PaddleOCR -> VietOCR -> TrOCR)"


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image part in the request"}), 400

    file = request.files["image"]

    try:
        img_bytes = file.read()
        pil_img = Image.open(io.BytesIO(img_bytes))

        # ===== 1) PaddleOCR detect+recog =====
        bgr = preprocess_for_paddle(pil_img)
        result = paddle.predict(bgr)

        details = []
        texts = []

        # PaddleOCR v3 predict() -> list[Result], lấy dict qua .json
        if result and len(result) > 0 and hasattr(result[0], "json"):
            r = result[0].json  # dict
            rec_texts = r.get("rec_texts", [])
            rec_scores = r.get("rec_scores", [])
            rec_polys = r.get("rec_polys", [])

            for txt, score, poly in zip(rec_texts, rec_scores, rec_polys):
                txt = (txt or "").strip()
                if txt:
                    texts.append(txt)
                details.append({
                    "text": txt,
                    "score": float(score) if score is not None else 0.0,
                    "box": poly
                })

        ocr_text = " ".join(texts).strip()
        num_boxes = len(details)

        # ===== 2) Fallback VietOCR (Vietnamese printed) =====
        model_used = "paddle"
        if num_boxes == 0 or ocr_text == "":
            ocr_text = run_vietocr(pil_img)
            model_used = "vietocr_fallback"

        # ===== 3) Last resort TrOCR (handwritten) =====
        if ocr_text == "":
            ocr_text = run_trocr(pil_img)
            model_used = "trocr_fallback"

        return jsonify({
            "message": "OK",
            "model_used": model_used,
            "num_boxes": num_boxes,
            "ocr_text": ocr_text,
            "details": details
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
