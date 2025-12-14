import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

class Evaluation:
    def __init__(self, model, X, y):
        self.model = model
        self.X = X
        self.y = y

    def evaluate_model_multiclass(self):
        y_pred = self.model.predict(self.X)
        accuracy = np.mean(y_pred == self.y)

        K = self.model.n_classes
        cm = np.zeros((K, K), dtype=int)
        for t, p in zip(self.y, y_pred):
            cm[t, p] += 1

        precisions, recalls, f1s = [], [], []
        for k in range(K):
            tp = cm[k, k]
            fp = cm[:, k].sum() - tp
            fn = cm[k, :].sum() - tp

            precision = tp / (tp + fp + 1e-8)
            recall    = tp / (tp + fn + 1e-8)
            f1        = 2 * precision * recall / (precision + recall + 1e-8)

            precisions.append(precision)
            recalls.append(recall)
            f1s.append(f1)

        precision_macro = float(np.mean(precisions))
        recall_macro = float(np.mean(recalls))
        f1_macro = float(np.mean(f1s))

        return accuracy, precision_macro, recall_macro, f1_macro, cm
    
    def visualize_confusion_matrix(self, cm, title="Confusion Matrix"):
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.xlabel('Predicted Label')
        plt.ylabel('True Label')
        plt.title(title if title else 'Confusion Matrix')
        plt.show()
        return