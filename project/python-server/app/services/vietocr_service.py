from PIL import Image

from .preprocess import preprocess_for_vietocr
#from .models import init_model


def run_vietocr(model, pil_img: Image.Image) -> str:
    text = model.predict(pil_img)
    return (text or "").strip()
