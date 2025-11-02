from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# TFLite Model Setup - New high-accuracy model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "plant_leaf_diseases_model.tflite")
CLASS_NAMES = [
    "Pepper_bell_Bacterial_spot",
    "Pepperbell_healthy",
    "Potato_Early_blight",
    "Potato_Late_blight",
    "Potato_healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "TomatoTarget_Spot",
    "TomatoTomato_YellowLeafCurl_Virus",
    "Tomato_Tomato_mosaic_virus",
    "Tomato_healthy"
]

# Load TFLite model
try:
    if not os.path.isfile(MODEL_PATH):
        raise RuntimeError(f"Model file not found at {MODEL_PATH}")
    
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()[0]
    output_details = interpreter.get_output_details()[0]
    model_loaded = True
    print(f"TFLite disease detection model loaded successfully from {MODEL_PATH}!")
    print(f"Model supports {len(CLASS_NAMES)} classes")
except Exception as e:
    print(f"Error loading TFLite disease detection model: {e}")
    interpreter = None
    input_details = None
    output_details = None
    model_loaded = False

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess image for TFLite model - resize to 256x256 and normalize"""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((256, 256), Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.route('/api/detect-disease', methods=['POST', 'OPTIONS'])
def detect_disease():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response('', 200))
    
    if not model_loaded:
        return add_cors_headers(jsonify({'error': 'Model not loaded - TFLite model file not found or failed to load'})), 500
    
    if 'leaf' not in request.files:
        return add_cors_headers(jsonify({'error': 'No leaf image uploaded'})), 400
    
    try:
        file = request.files['leaf']
        
        # Read image bytes
        img_bytes = file.read()
        
        # Validate that the file is an image
        try:
            img = Image.open(io.BytesIO(img_bytes))
            img.verify()
        except Exception as img_error:
            return add_cors_headers(jsonify({'error': 'Invalid image file'})), 400
        
        # Preprocess image for TFLite model (256x256)
        data = preprocess_image(img_bytes)
        
        # Run TFLite inference
        interpreter.set_tensor(input_details["index"], data)
        interpreter.invoke()
        raw_output = interpreter.get_tensor(output_details["index"])
        out = np.array(raw_output).flatten()
        
        if out.shape[0] != len(CLASS_NAMES):
            return add_cors_headers(jsonify({
                "error": "Model output length mismatch",
                "output_len": int(out.shape[0]),
                "num_classes": len(CLASS_NAMES)
            })), 500
        
        # Get top prediction and top 3
        top_idx = int(np.argmax(out))
        top3_idx = np.argsort(out)[-3:][::-1]
        top3 = [{"label": CLASS_NAMES[i], "score": float(out[i] * 100)} for i in top3_idx]
        
        predicted = CLASS_NAMES[top_idx]
        confidence = float(out[top_idx] * 100)
        
        # Determine if healthy
        is_healthy = 'healthy' in predicted.lower()
        
        # Create user-friendly disease name
        disease_display = predicted.replace('_', ' ').title()
        if 'Healthy' in disease_display:
            result_message = "No disease detected - Plant appears healthy"
            disease_status = "Healthy"
        else:
            result_message = f"Disease detected: {disease_display}"
            disease_status = disease_display

        return add_cors_headers(jsonify({
            "disease": disease_status,
            "predicted": predicted,
            "confidence": confidence,
            "message": result_message,
            "top3": top3,
            "prediction_details": {
                "detected_condition": disease_display,
                "confidence_percentage": confidence,
                "is_healthy": is_healthy
            }
        }))
    except Exception as e:
        import traceback
        print(f"Error in disease detection: {e}")
        traceback.print_exc()
        return add_cors_headers(jsonify({'error': f'Error processing image: {str(e)}'})), 500

@app.route('/api/detect-soil', methods=['POST', 'OPTIONS'])
def detect_soil():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response('', 200))
    if 'image' not in request.files:
        return add_cors_headers(jsonify({'error': 'No image uploaded'})), 400
    image = request.files['image']
    soil_type = "Loamy"
    return add_cors_headers(jsonify({'soil_type': soil_type}))

@app.route('/api/recommend-plants', methods=['POST', 'OPTIONS'])
def recommend_plants():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response('', 200))
    try:
        data = request.get_json(force=True, silent=True) or {}
        soil_type = data.get('soil_type') or 'Loamy'
        location = data.get('location', '')
        temperature = data.get('temperature')
        try:
            temperature = int(temperature)
        except (TypeError, ValueError):
            temperature = 25
        plant_map = {
            "Sandy": [("Carrot", (15, 25)), ("Potato", (15, 20)), ("Peanut", (20, 30))],
            "Clay": [("Rice", (20, 30)), ("Broccoli", (15, 25)), ("Cabbage", (15, 20))],
            "Silty": [("Tomato", (20, 30)), ("Pea", (13, 18)), ("Soybean", (20, 30))],
            "Peaty": [("Cranberry", (10, 20)), ("Blueberry", (13, 21))],
            "Chalky": [("Spinach", (10, 20)), ("Beetroot", (15, 25))],
            "Loamy": [("Wheat", (12, 25)), ("Maize", (18, 27)), ("Sugarcane", (20, 30))],
            "Red Soil": [("Millet", (20, 30)), ("Groundnut", (20, 30)), ("Cotton", (21, 30))],
            "Black Soil": [("Cotton", (21, 30)), ("Sorghum", (20, 30)), ("Soybean", (20, 30))],
            "Alluvial Soil": [("Paddy", (20, 30)), ("Sugarcane", (20, 30)), ("Jute", (24, 35))],
            "Laterite Soil": [("Cashew", (20, 30)), ("Pineapple", (20, 30)), ("Tea", (18, 25))],
            "Saline Soil": [("Barley", (12, 25)), ("Cotton", (21, 30))],
            "Alkaline Soil": [("Rice", (20, 30)), ("Wheat", (12, 25))],
            "Coastal Alluvium": [("Coconut", (20, 30)), ("Paddy", (20, 30))],
            "Deltaic Alluvium": [("Paddy", (20, 30)), ("Banana", (20, 30))],
            "Mixed Red and Black Soil": [("Cotton", (21, 30)), ("Groundnut", (20, 30))],
            "Forest Soil": [("Tea", (18, 25)), ("Coffee", (15, 25))],
            "Calcareous Soil": [("Sugarcane", (20, 30)), ("Wheat", (12, 25))],
        }
        recommendations = []
        if soil_type in plant_map and temperature is not None:
            for plant, (t_min, t_max) in plant_map[soil_type]:
                if t_min <= temperature <= t_max:
                    recommendations.append(plant)
            if not recommendations:
                recommendations = [f"No suitable plant found for {soil_type} at {temperature}°C"]
        else:
            recommendations = ["No recommendation found"]
        return add_cors_headers(jsonify({'recommendations': recommendations}))
    except Exception as e:
        print("Error in recommend_plants:", e)
        return add_cors_headers(jsonify({'recommendations': ["No recommendation found (error)"]})), 200

if __name__ == '__main__':
    app.run(port=5000, debug=False)
