import numpy as np
import matplotlib.pyplot as plt
import streamlit as st
import sys
from pathlib import Path
from PIL import Image

# ---------------- Path setup ----------------
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# local modules
import model as softmax_module
import PCA.PCA as pca_module

# external
import cv2

# ---------------- Feature extractors ----------------
def extract_edge_features(images):
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
    return np.array(features, dtype=np.float64)

# ---------------- Helper ----------------
def plot_probability(probs, true_label=None):
    """
    Vẽ biểu đồ cột thể hiện xác suất của 10 lớp.
    probs: array shape (10,)
    true_label: nhãn đúng (nếu có) để so sánh
    """
    classes = np.arange(10)
    fig, ax = plt.subplots(figsize=(6, 3))
    
    colors = ['#d3d3d3'] * 10
    pred_label = np.argmax(probs)
    colors[pred_label] = '#ff7f0e'  
    
    if true_label is not None and true_label != pred_label:
        colors[true_label] = '#2ca02c' 

    bars = ax.bar(classes, probs, color=colors)
    
    ax.set_xticks(classes)
    ax.set_xlabel("Digit Class")
    ax.set_ylabel("Probability")
    ax.set_ylim(0, 1.1)
    ax.set_title(f"Prediction Confidence (Predicted: {pred_label})")
    
    for bar in bars:
        height = bar.get_height()
        if height > 0.01: 
            ax.annotate(f'{height:.2f}',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3), 
                        textcoords="offset points",
                        ha='center', va='bottom', fontsize=8)
    
    return fig

# ---------------- Load model + transform ----------------
@st.cache_resource
def load_checkpoint(ckpt_path: str, model_name: str):
    ckpt_path = Path(ckpt_path)
    if not ckpt_path.exists():
        raise FileNotFoundError(f"Checkpoint not found: {ckpt_path}")

    softmax = softmax_module.SoftmaxRegression(lr=0.1, epochs=150, n_classes=10)
    data = np.load(ckpt_path, allow_pickle=True)

    if "weights" in data: softmax.W = data["weights"]
    elif "W" in data: softmax.W = data["W"]
    else: raise KeyError("Checkpoint missing weights.")

    if "b" in data: softmax.b = data["b"]
    else: raise KeyError("Checkpoint missing bias.")

    if model_name == "pca":
        U_m = data["U_m"]
        mu = data["mu"]
        n_components = U_m.shape[1] if U_m.ndim == 2 else int(data.get("n_components", 0))
        pca = pca_module.PCA(n_components=n_components)
        pca.mu = mu
        pca.U_m = U_m
        transform = pca
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

    if X_test.ndim == 3:
        X_test_flat = X_test.reshape(len(X_test), -1)
    else:
        X_test_flat = X_test

    X_test_flat = normalize_if_needed(X_test_flat)

    if name_model == "edges":
        if X_test.ndim == 2: X_img = X_test.reshape(len(X_test), 28, 28)
        else: X_img = X_test
        X_test_transformed = transform(X_img)
    elif name_model == "pca":
        X_test_transformed = transform.transform(X_test_flat)
    else:
        X_test_transformed = transform(X_test_flat)

    y_pred = softmax.predict(X_test_transformed)
    y_probs = softmax.predict_proba(X_test_transformed) # <--- MỚI

    accuracy = float(np.mean(y_pred == y_test))
    st.success(f"Model Accuracy: {accuracy:.4f}")

    st.write("### Prediction Analysis")
    n_show = min(5, len(X_test))
    
    for i in range(n_show):
        st.markdown(f"**Sample {i+1}:** True Label: `{y_test[i]}` | Predicted: `{y_pred[i]}`")
        
        col1, col2 = st.columns([1, 2]) 
        
        with col1:
            img_2d = X_test[i]
            if img_2d.ndim == 1: img_2d = img_2d.reshape(28, 28)
            fig_img, ax_img = plt.subplots(figsize=(2,2))
            ax_img.imshow(img_2d, cmap="gray")
            ax_img.axis("off")
            st.pyplot(fig_img)
            
        with col2:
            fig_prob = plot_probability(y_probs[i], true_label=y_test[i])
            st.pyplot(fig_prob)
        
        st.divider()

st.write("Or upload a **single image** (.png/.jpg) to predict one sample.")
single_img = st.file_uploader("Upload one digit image", type=["png", "jpg", "jpeg"], key="single")

if single_img is not None:
    img = Image.open(single_img).convert("L").resize((28, 28))
    img_arr = np.array(img, dtype=np.float32)

    if img_arr.max() > 1.5:
        img_arr = img_arr / 255.0

    if name_model == "edges":
        x_transformed = extract_edge_features(img_arr[None, ...])
    else:
        x_flat = img_arr.reshape(1, -1)
        if name_model == "pca":
            x_transformed = transform.transform(x_flat)
        else:
            x_transformed = transform(x_flat)

    pred_label = softmax.predict(x_transformed)[0]
    pred_probs = softmax.predict_proba(x_transformed)[0] # <--- MỚI

    st.info(f"Predicted Label: {pred_label}")

    col1, col2 = st.columns([1, 2])
    with col1:
        st.write("Input Image:")
        fig, ax = plt.subplots(figsize=(3,3))
        ax.imshow(np.array(img), cmap="gray")
        ax.axis("off")
        st.pyplot(fig)
    
    with col2:
        st.write("Probability Distribution:")
        fig_prob = plot_probability(pred_probs)
        st.pyplot(fig_prob)