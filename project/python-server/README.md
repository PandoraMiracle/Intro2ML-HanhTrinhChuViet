# Python OCR Server

A modular Flask server that orchestrates PaddleOCR (VN), VietOCR (printed VN), and TrOCR (handwritten fallback).

## Structure

- app/
  - **init**.py: Flask app factory and blueprint registration
  - routes/ocr.py: HTTP routes ("/", "/predict")
  - services/
    - preprocess.py: image preprocessing helpers
    - models.py: singletons for OCR models (PaddleOCR, VietOCR, TrOCR)
    - paddle_service.py: PaddleOCR inference wrapper
    - vietocr_service.py: VietOCR inference wrapper
    - trocr_service.py: TrOCR inference wrapper
- app.py: minimal entrypoint using the app factory
- requirements.txt: dependencies

## Quick start

```bash
# From project/python-server
python -m venv .venv
.venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# Run
python app.py
```

## API

- GET `/` → health text
- POST `/predict` with form-data key `image` (file)
  - Returns JSON with `ocr_text`, `model_used`, `num_boxes`, and `details` (boxes/scores).
