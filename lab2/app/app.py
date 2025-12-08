import numpy as np
import matplotlib.pyplot as plt
import streamlit as st

import model as softmax_module
import PCA as pca_module


# ---------- Load model + PCA params ----------
@st.cache_resource
def load_checkpoint(ckpt_path="./PCA/model/softmax_regression_model_PCA100.npz", n_components=100):
    # init objects
    softmax = softmax_module.SoftmaxRegression(lr=0.1, epochs=1000, n_classes=10)
    pca = pca_module.PCA(n_components=n_components)

    data = np.load(ckpt_path)

    # Softmax weights
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
    # PCA params
    if "mu" in data and "U_m" in data:
        pca.mu = data["mu"]
        pca.U_m = data["U_m"]
    else:
        raise KeyError("Checkpoint missing PCA params mu/U_m.")

    return softmax, pca



# ---------- UI ----------
st.title("Softmax Regression + PCA Evaluation")

softmax, pca = load_checkpoint()

st.write("Upload a test dataset (.npz) containing `images` and `labels`.")

test_file = st.file_uploader("Upload test data (.npz)", type=["npz"])

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

    X_test_flat = X_test_flat.astype(np.float32)

    # if values look like 0..255 -> normalize
    if X_test_flat.max() > 1.5:
        X_test_flat = X_test_flat / 255.0

    # PCA features
    X_test_pca = pca(X_test_flat)

    # -------- predict --------
    y_pred = softmax.predict(X_test_pca)

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
    from PIL import Image

    img = Image.open(single_img).convert("L").resize((28, 28))
    x = np.array(img, dtype=np.float64).reshape(1, -1) / 255.0

    x_pca = pca.transform(x)
    pred = softmax.predict(x_pca)

    st.info(f"Predicted Label: {int(pred[0])}")

    fig, ax = plt.subplots()
    ax.imshow(np.array(img), cmap="gray")
    ax.axis("off")
    st.pyplot(fig)
