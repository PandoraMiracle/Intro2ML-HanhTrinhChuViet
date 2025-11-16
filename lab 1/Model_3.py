import numpy as np

class OLSLinearRegression:
    def fit(self, X, y):
        """
        Fit mô hình OLS: w = (X^T X)^(-1) X^T y  (ở đây dùng pseudo-inverse cho an toàn)
        X: (n_samples, n_features)
        y: (n_samples,) hoặc (n_samples, 1)
        """
        X = np.asarray(X)
        y = np.asarray(y)

        if y.ndim == 1:
            y = y.reshape(-1, 1)

        # pseudo-inverse: (X^T X)^(-1) X^T = pinv(X)
        X_pinv = np.linalg.pinv(X)
        self.w = X_pinv @ y   # (n_features, 1)

        return self

    def get_params(self):
        # Trả về weight như bạn muốn
        return self.w

    def set_params(self, w):
        self.w = np.asarray(w)
        return self
        
    def predict(self, X):
        X = np.asarray(X)
        y_pred = X @ self.w    # (n_samples, 1)
        return y_pred.ravel()
