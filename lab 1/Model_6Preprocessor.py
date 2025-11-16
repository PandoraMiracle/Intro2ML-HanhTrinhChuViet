import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OneHotEncoder

class Model6Preprocessor(BaseEstimator, TransformerMixin):
    def __init__(self, add_bias=True):
        self.add_bias = add_bias

    def fit(self, X, y=None):
        X = pd.DataFrame(X).copy()
        # encoder cho cột 'quan'
        self.encoder = OneHotEncoder(handle_unknown='ignore')
        self.encoder.fit(X[['quan']])

        # tên cột one-hot
        self.quan_feature_names_ = self.encoder.get_feature_names_out(['quan'])
        # tên feature interaction
        self.new_feature_names_ = [
            f"{name}_x_dientichdat" for name in self.quan_feature_names_
        ]
        return self

    def transform(self, X):
        X = pd.DataFrame(X).copy()

        # one-hot cho 'quan'
        quan_ohe = self.encoder.transform(X[['quan']]).toarray()   # (n_samples, n_quan)
        dientich = X['dien_tich_dat_m2'].to_numpy().reshape(-1, 1) # (n_samples, 1)

        # interaction: quan_i * dien_tich_dat_m2
        interaction = quan_ohe * dientich                           # (n_samples, n_quan)

        if self.add_bias:
            bias = np.ones((interaction.shape[0], 1))
            X_out = np.hstack([bias, interaction])                  # (n_samples, 1+n_quan)
        else:
            X_out = interaction

        return X_out
