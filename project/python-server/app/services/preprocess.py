from PIL import Image
import numpy as np
import cv2


def ensure_white_bg(pil_img: Image.Image) -> Image.Image:
    if pil_img.mode in ("RGBA", "LA"):
        bg = Image.new("RGBA", pil_img.size, (255, 255, 255, 255))
        pil_img = Image.alpha_composite(bg, pil_img.convert("RGBA")).convert("RGB")
    else:
        pil_img = pil_img.convert("RGB")
    return pil_img


def crop_to_ink(pil_img: Image.Image, pad: int = 20) -> Image.Image:
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


# def preprocess_for_paddle(pil_img: Image.Image) -> np.ndarray:
#     pil_img = crop_to_ink(pil_img, pad=25)
#     rgb = np.array(pil_img)

#     lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB)
#     l, a, b = cv2.split(lab)
#     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
#     l2 = clahe.apply(l)
#     lab2 = cv2.merge([l2, a, b])
#     rgb2 = cv2.cvtColor(lab2, cv2.COLOR_LAB2RGB)

#     bgr = cv2.cvtColor(rgb2, cv2.COLOR_RGB2BGR)
#     return bgr


def preprocess_for_vietocr(pil_img: Image.Image) -> Image.Image:
    pil_img = crop_to_ink(pil_img, pad=25).convert("RGB")
    w, h = pil_img.size
    if max(w, h) < 800:
        pil_img = pil_img.resize((w * 2, h * 2), Image.BICUBIC)
    return pil_img


# def preprocess_for_trocr(pil_img: Image.Image) -> Image.Image:
#     pil_img = crop_to_ink(pil_img, pad=30)
#     gray = np.array(pil_img.convert("L"))

#     _, th = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
#     th = cv2.dilate(th, np.ones((2, 2), np.uint8), iterations=1)
#     th = 255 - th

#     return Image.fromarray(th).convert("RGB")
