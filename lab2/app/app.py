import numpy as np
import matplotlib.pyplot as plt
import streamlit as st
import sys
from pathlib import Path
import struct
from PIL import Image
from array import array
import gzip

# ---------------- Path setup BEFORE local imports ----------------
ROOT = Path(__file__).resolve().parents[1]  # thư mục lab2
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# local modules
import model as softmax_module
import PCA.PCA as pca_module

# external
import cv2


# ---------------- Feature extractors ----------------
def extract_edge_features(images):
    """
    Applies Sobel to extract edge feature from images.
    Expect images shape: (N, 28, 28).
    Returns flattened feature vectors: (N, 784).
    """
    features = []
    for img in images:
        img_float = img.astype(np.float64)

        sobelx = cv2.Sobel(img_float, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(img_float, cv2.CV_64F, 0, 1, ksize=3)

        magnitude = np.sqrt(sobelx**2 + sobely**2)

        max_val = np.max(magnitude)
        if max_val > 0:
            magnitude = magnitude / max_val

        features.append(magnitude.flatten())

    return np.array(features, dtype=np.float32)


# ---------------- Load model + transform ----------------
@st.cache_resource
def load_checkpoint(ckpt_path: str, model_name: str):
    ckpt_path = Path(ckpt_path)

    if not ckpt_path.exists():
        raise FileNotFoundError(f"Checkpoint not found: {ckpt_path}")

    # init softmax "shell"
    softmax = softmax_module.SoftmaxRegression(lr=0.1, epochs=150, n_classes=10)

    data = np.load(ckpt_path, allow_pickle=True)

    # ---- Softmax params ----
    if "weights" in data:
        softmax.W = data["weights"]
    elif "W" in data:
        softmax.W = data["W"]
    else:
        raise KeyError("Checkpoint missing weights/W key.")

    if "b" in data:
        softmax.b = data["b"]
    else:
        raise KeyError("Checkpoint missing bias b key.")

    # ---- Transform ----
    if model_name == "pca":
        # Prefer stored U_m/mu if available
        if "mu" not in data or "U_m" not in data:
            raise KeyError("Checkpoint missing PCA params mu/U_m.")

        U_m = data["U_m"]
        mu = data["mu"]

        # infer n_components from U_m shape
        n_components = U_m.shape[1] if U_m.ndim == 2 else int(data.get("n_components", 0))

        pca = pca_module.PCA(n_components=n_components)
        pca.mu = mu
        pca.U_m = U_m

        transform = pca  # will use .transform()

    elif model_name == "edges":
        transform = extract_edge_features

    elif model_name == "raw":
        transform = lambda x: x

    else:
        raise ValueError(f"Unknown model_name: {model_name}")

    return softmax, transform


# ---------------- UI ----------------
st.title("Softmax Regression Evaluation")

name_model = st.selectbox("Select model type", options=["pca", "edges", "raw"])

ckpt_file = ROOT / "para_model" / f"model_{name_model}.npz"
softmax, transform = load_checkpoint(str(ckpt_file), model_name=name_model)

st.write("Upload a test dataset (.npz) containing `images` and `labels`.")

test_file = st.file_uploader("Upload test data (.npz)", type=["npz"])


def normalize_if_needed(X_flat):
    X_flat = X_flat.astype(np.float32)
    if X_flat.max() > 1.5:
        X_flat = X_flat / 255.0
    return X_flat


if test_file is not None:
    with np.load(test_file) as data:
        X_test = data["images"]
        y_test = data["labels"]

    # -------- preprocess --------
    # X_test could be (N, 28, 28) or (N, 784)
    if X_test.ndim == 3:
        X_test_flat = X_test.reshape(len(X_test), -1)
    else:
        X_test_flat = X_test

    X_test_flat = normalize_if_needed(X_test_flat)

    # -------- feature transform --------
    if name_model == "edges":
        # edges expects (N, 28, 28)
        if X_test.ndim == 2:
            X_img = X_test.reshape(len(X_test), 28, 28)
        else:
            X_img = X_test
        X_test_transformed = transform(X_img)

    elif name_model == "pca":
        # IMPORTANT: do NOT fit on test
        X_test_transformed = transform.transform(X_test_flat)

    else:
        # raw
        X_test_transformed = transform(X_test_flat)

    # -------- predict --------
    y_pred = softmax.predict(X_test_transformed)
    accuracy = float(np.mean(y_pred == y_test))
    st.success(f"Model Accuracy: {accuracy:.4f}")

    st.write("Some Predictions:")
    n_show = min(5, len(X_test))
    for i in range(n_show):
        st.write(f"True Label: {y_test[i]} | Predicted Label: {y_pred[i]}")

        img_2d = X_test[i]
        if img_2d.ndim == 1:
            img_2d = img_2d.reshape(28, 28)

        fig, ax = plt.subplots()
        ax.imshow(img_2d, cmap="gray")
        ax.axis("off")
        st.pyplot(fig)


st.divider()
st.write("Or upload a **single image** (.png/.jpg) to predict one sample.")

single_img = st.file_uploader("Upload one digit image", type=["png", "jpg", "jpeg"], key="single")

if single_img is not None:

    img = Image.open(single_img).convert("L").resize((28, 28))
    img_arr = np.array(img, dtype=np.float32)

    # normalize to 0..1
    if img_arr.max() > 1.5:
        img_arr = img_arr / 255.0

    if name_model == "edges":
        # edges expects (N, 28, 28)
        x_transformed = extract_edge_features(img_arr[None, ...])

    else:
        x_flat = img_arr.reshape(1, -1)

        if name_model == "pca":
            x_transformed = transform.transform(x_flat)
        else:
            x_transformed = transform(x_flat)

    pred = softmax.predict(x_transformed)
    st.info(f"Predicted Label: {int(pred[0])}")

    fig, ax = plt.subplots()
    ax.imshow(np.array(img), cmap="gray")
    ax.axis("off")
    st.pyplot(fig)
