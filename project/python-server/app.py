from flask import Flask, request, jsonify
from PIL import Image
import io

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Python Server!"

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400
    
    file = request.files['image']

    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        
        # Hiển thị hình ảnh
        img.show()

        return jsonify({
            'message': 'OK',
            'dummy_prediction': 'cat'  
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)