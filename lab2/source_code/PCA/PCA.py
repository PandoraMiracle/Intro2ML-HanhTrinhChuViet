import numpy as np

class PCA:
    def __init__(self, n_components):
        self.n_components = n_components
        self.U_m = None
        self.mu = None
        self.eigvals_sorted = None

    def fit(self, X):
        """
        X: (N, d) numpy
        """
        X = X.astype(np.float64)

        # 1) mean center and normalize
        self.mu = X.mean(axis=0)
        Xc = X - self.mu

        # 2) covariance
        N = X.shape[0]
        C = (Xc.T @ Xc) / N

        # 3) eigen decomposition
        eigvals, eigvecs = np.linalg.eigh(C)

        # 4) sort descending
        idx = np.argsort(eigvals)[::-1]
        self.eigvals_sorted = eigvals[idx]
        eigvecs_sorted = eigvecs[:, idx]

        # 5) take top m
        self.U_m = eigvecs_sorted[:, :self.n_components]

        return self

    def transform(self, X):
        """
        X: (N, d) numpy
        """
        if self.U_m is None or self.mu is None:
            raise ValueError("PCA must be fitted before calling transform().")

        X = X.astype(np.float64)
        Xc = X - self.mu
        return Xc @ self.U_m

    def fit_transform(self, X):
        self.fit(X)
        return self.transform(X)