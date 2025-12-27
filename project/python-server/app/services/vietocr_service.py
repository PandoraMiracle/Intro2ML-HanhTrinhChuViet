from PIL import Image

from .preprocess import preprocess_for_vietocr
from .models import vietocr_predictor


def run_vietocr(pil_img: Image.Image) -> str:
    img = preprocess_for_vietocr(pil_img)
    text = vietocr_predictor.predict(img)
    return (text or "").strip()
