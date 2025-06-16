from flask import Flask, render_template, request
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)

# Load model
model = tf.keras.models.load_model('model_gigi_cnn.h5')
class_names = ['Bengkak Gusi', 'Gigi Berlubang', 'Gigi Sehat', 'Plak Gigi']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'gambar' not in request.files:
        return 'No file part'

    file = request.files['gambar']
    if file.filename == '':
        return 'No selected file'

    img_path = os.path.join('static', file.filename)
    file.save(img_path)

    # Preprocess
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    # Predict
    prediction = model.predict(img_array)
    predicted_index = np.argmax(prediction)
    predicted_class = class_names[predicted_index]
    confidence = float(np.max(prediction))

    return render_template('result.html',
                           image_path=img_path,
                           label=predicted_class,
                           confidence=round(confidence*100, 2))

if __name__ == '__main__':
    app.run(debug=True)
