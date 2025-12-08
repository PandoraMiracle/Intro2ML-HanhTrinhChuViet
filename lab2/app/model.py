import numpy as np
class SoftmaxRegression:
    def __init__(self, lr=0.1, epochs=1000, n_classes=10):
        self.lr = lr
        self.epochs = epochs
        self.n_classes = n_classes
        self.W = None
        self.b = None
        self.losses = []

    def one_hot_encode(self, y):
        one_hot = np.zeros((len(y), self.n_classes))
        one_hot[np.arange(len(y)), y] = 1
        return one_hot

    def softmax(self, z):
        z = z - np.max(z, axis=1, keepdims=True)
        exp_z = np.exp(z)
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.W = np.zeros((n_features, self.n_classes), dtype=np.float32)
        self.b = np.zeros((self.n_classes,), dtype=np.float32)
        y_encoded = self.one_hot_encode(y)

        for i in range(self.epochs):
            z = X @ self.W + self.b
            y_pred = self.softmax(z)

            loss = -np.mean(np.sum(y_encoded * np.log(y_pred + 1e-8), axis=1))
            self.losses.append(loss)

            dW = (1 / n_samples) * (X.T @ (y_pred - y_encoded))
            db = (1 / n_samples) * np.sum(y_pred - y_encoded, axis=0)

            self.W -= self.lr * dW
            self.b -= self.lr * db

            if (i + 1) % 100 == 0:
                print(f"Epoch {i+1}, Loss: {loss:.4f}")

    def predict(self, X):
        z = X @ self.W + self.b
        y_pred = self.softmax(z)
        return np.argmax(y_pred, axis=1)
