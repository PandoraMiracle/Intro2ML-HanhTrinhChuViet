import pandas as pd
import numpy as np
import joblib

import streamlit as st
import matplotlib.pyplot as plt
from Model_3Preprocessor import Model3Preprocessor
from Model_3 import OLSLinearRegression

from visualize import (
    eda_correlation_significance,
    eda_scatter_feature_vs_target
)

# Nếu bạn TRAIN trên log_gia (np.log1p(gia)) thì đặt True
# Nếu bạn TRAIN trực tiếp trên 'gia' thì đặt False
USE_LOG_TARGET = False


# Load model
@st.cache_resource
def load_model():
    return joblib.load("./Full_Pipeline_Models/house_price_best_model.joblib")


@st.cache_data
def load_performance():
    per_df = pd.read_csv("./Performance_Model/model_performance_report.csv")
    per_df = per_df.sort_values(by="Test R2", ascending=True).reset_index(drop=True)
    return per_df


@st.cache_data
def load_train_data():
    train = pd.read_csv("./Data/train_data.csv")

    # Bỏ cột categorical
    cat_cols = train.select_dtypes(include=["object"]).columns.tolist()
    train = train.drop(columns=cat_cols)

    # Giả sử cột cuối là target
    X_train = train.iloc[:, :-1]
    y_train = train.iloc[:, -1]

    # TODO: nếu target của bạn tên là 'gia'
    y_train = y_train.rename("gia") 

    df_train = pd.concat([X_train, y_train], axis=1)
    return df_train, X_train.columns.tolist()


# =========================
# 2. Giao diện web
# =========================
def main():
    st.title("Ứng dụng dự đoán giá nhà")

    model = load_model()
    per = load_performance()
    df_train, feature_cols = load_train_data()

    # Lấy best model theo Test R2 (hàng cuối sau khi sort)
    best_r2 = per.iloc[-1]["Test R2"]
    best_model_name = per.iloc[-1]["Model"]

    # --- Tabs ---
    tab_predict, tab_eda = st.tabs(["Dự đoán giá", "EDA - Giá nhà"])

    # =====================================================
    # TAB 1: Dự đoán giá nhà
    # =====================================================
    with tab_predict:
        st.subheader("Nhập thông tin căn nhà")

        quan_in = {
            "Quan 1": "1", "Quan 2": "2", "Quan 3": "3", "Quan 4": "4", "Quan 5": "5",
            "Quan 6": "6", "Quan 7": "7", "Quan 8": "8", "Quan 9": "9", "Quan 10": "10",
            "Quan 11": "11", "Quan 12": "12", "Binh Thanh": "Binh Thanh",
            "Phu Nhuan": "Phu Nhuan", "Tan Binh": "Tan Binh", "Go Vap": "Go Vap",
            "Binh Tan": "Binh Tan", "Nha Be": "Nha Be", "Thu Duc": "Thu Duc",
            "Cu Chi": "Cu Chi", "Hoc Mon": "Hoc Mon", "Can Gio": "Can Gio"
        }

        quan = st.selectbox(
            "Quận",
            options=list(quan_in.keys())
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
            if best_model_name == "OLS with Interaction Features":
                y_pred = model.predict(input_df[["quan","dien_tich_dat_m2"]])
            else:
                y_pred = model.predict(input_df)

            # Nếu model train trên log(gia) thì phải convert ngược lại
            if USE_LOG_TARGET:
                gia_pred = np.expm1(y_pred[0])  # log1p -> expm1
            else:
                gia_pred = y_pred[0]

            st.subheader("Kết quả dự đoán")
            st.write(f"Giá nhà dự đoán: **{gia_pred:,.2f}** (tỷ VNĐ)")
            st.write(
                f"Model đang dùng: **{best_model_name}**, "
                f"R² trên tập Test = **{best_r2:.4f}**"
            )

            st.success("Cảm ơn bạn đã sử dụng ứng dụng!")

        st.markdown("---")
        st.subheader("Tổng quan các mô hình")
        st.dataframe(per)

    # =====================================================
    # TAB 2: EDA – Khám phá dữ liệu giá nhà
    # =====================================================
    with tab_eda:
        # --- Scatter Plot ---
        st.subheader("Scatter plot: Feature vs Price House")

        feature = st.selectbox(
            "Chọn 1 feature để vẽ scatter",
            options=feature_cols
        )

        if feature:
            fig = eda_scatter_feature_vs_target(
                df_train, feature=feature, target="gia"
            )
            st.pyplot(fig)



if __name__ == "__main__":
    main()
