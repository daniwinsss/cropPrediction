import os
import pickle
from flask import Flask,request,render_template,jsonify
import numpy as np

flask_app = Flask(__name__)
model = pickle.load(open('model.pkl','rb'))

@flask_app.route('/')
def home():
    return render_template('index.html')
@flask_app.route('/predict',methods = ['POST'])
def predict():
    try:
        data = request.get_json()
        float_features = [float(data.get(key, 0)) for key in ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall']]
        features = [np.array(float_features)]
        probabilities = model.predict_proba(features)[0]
        prediction_index = np.argmax(probabilities)
        prediction = model.classes_[prediction_index]
        confidence = float(probabilities[prediction_index])
        return jsonify({'crop': str(prediction), 'confidence': confidence})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    flask_app.run(host="0.0.0.0", port=port, debug=False)
