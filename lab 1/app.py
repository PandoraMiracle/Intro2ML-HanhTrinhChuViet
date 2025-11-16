import numpy as np
import pandas as pd
import joblib
import streamlit as st

# =========================
# 1. Load mô hình đã train
# =========================

model = joblib.load("Models/house_price_Linear_poly_model.joblib")

# Nếu bạn TRAIN trên log_gia (np.log1p(gia)) thì đặt True
# Nếu bạn TRAIN trực tiếp trên 'gia' thì đặt False
USE_LOG_TARGET = False

# =========================
# 2. Giao diện web
# =========================

st.title("Dự đoán giá nhà")

st.write("Nhập thông tin căn nhà bên dưới để dự đoán giá:")

# Nhập các feature
quan_in = {"Quan 1": "1", "Quan 2": "2", "Quan 3": "3", "Quan 4": "4", "Quan 5": "5",
           "Quan 6": "6", "Quan 7": "7", "Quan 8": "8", "Quan 9": "9", "Quan 10": "10",
           "Quan 11": "11", "Quan 12": "12", "Binh Thanh": "Binh Thanh", "Phu Nhuan": "Phu Nhuan",
           "Tan Binh": "Tan Binh", "Go Vap": "Go Vap", "Binh Tan": "Binh Tan", "Nha Be": "Nha Be",
           "Thu Duc": "Thu Duc", "Cu Chi": "Cu Chi", "Hoc Mon": "Hoc Mon", "Can Gio": "Can Gio"}

quan = st.selectbox(
    "Quận", 
    options= [
        "Quan 1", "Quan 2", "Quan 3", "Quan 4", "Quan 5", 
        "Quan 6", "Quan 7", "Quan 8", "Quan 9", "Quan 10",
        "Quan 11", "Quan 12", "Binh Thanh", "Phu Nhuan", 
        "Tan Binh", "Go Vap", "Binh Tan", "Nha Be", 
        "Thu Duc", "Cu Chi", "Hoc Mon", "Can Gio"
    ]
)

dien_tich_dat_m2 = st.number_input(
    "Diện tích đất (m²)", 
    min_value=1.0, 
    max_value=10000.0, 
    value=80.0
)

dien_tich_su_dung_m2 = st.number_input(
    "Diện tích sử dụng (m²)", 
    min_value=1.0, 
    max_value=20000.0, 
    value=120.0
)

phong_ngu = st.number_input(
    "Số phòng ngủ", 
    min_value=1, 
    max_value=20, 
    value=3
)

nha_tam = st.number_input(
    "Số nhà tắm", 
    min_value=1, 
    max_value=20, 
    value=2
)

if st.button("Dự đoán giá"):
    # Tạo DataFrame input đúng format model đã train
    input_df = pd.DataFrame({
        "quan": [quan_in[quan]],
        "dien_tich_dat_m2": [dien_tich_dat_m2],
        "dien_tich_su_dung_m2": [dien_tich_su_dung_m2],
        "phong_ngu": [phong_ngu],
        "nha_tam": [nha_tam],
    })

    # Gọi model.predict
    y_pred = model.predict(input_df)

    # Nếu model train trên log(gia) thì phải convert ngược lại
    if USE_LOG_TARGET:
        # model dự đoán log(1 + gia) → convert về gia
        gia_pred = np.expm1(y_pred[0])
    else:
        gia_pred = y_pred[0]

    st.subheader("Kết quả dự đoán:")
    st.write(f"Giá nhà dự đoán: **{gia_pred:,.2f}** (tỷ Việt Nam đồng)")
