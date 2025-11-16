import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import pearsonr

# =============================
# 1. Hàm EDA giống code gốc
# =============================

def eda_correlation_significance(df, target):
    results = []
    for col in df.columns:
        if col != target:
            r, p = pearsonr(df[col], df[target])
            results.append({
                'Feature': col,
                'Correlation': r,
                'p-value': p
            })
    results_df = pd.DataFrame(results)
    results_df = results_df.sort_values(
        by='Correlation', key=abs, ascending=False
    )
    return results_df


def eda_scatter_feature_vs_target(df, feature, target):
    fig, ax = plt.subplots()
    sns.scatterplot(x=df[feature], y=df[target], ax=ax)
    ax.set_xlabel(feature)
    ax.set_ylabel(target)
    ax.set_title(f"{feature} vs {target}")
    #st.pyplot(fig)
    return fig