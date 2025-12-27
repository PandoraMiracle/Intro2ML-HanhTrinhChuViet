import torch
from paddleocr import PaddleOCR
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
from transformers import TrOCRProcessor, VisionEncoderDecoderModel


# Device selection
device = "cuda" if torch.cuda.is_available() else "cpu"

vietocr_cfg = Cfg.load_config_from_name("vgg_transformer")
vietocr_cfg["device"] = device
vietocr_cfg["predictor"]["beamsearch"] = False
vietocr_predictor = Predictor(vietocr_cfg)
