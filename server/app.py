from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from flask_cors import CORS
from routes.auth import auth_bp  # Import the auth blueprint
from PIL import Image
import io
import random
import os
import subprocess
import re
import json
from fertilizer_ml import fertilizer_predictor  # Import ML predictor

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # This enables CORS for all routes
app.register_blueprint(auth_bp)  # Register the auth blueprint

# TFLite Model Setup - New high-accuracy model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "plant_leaf_diseases_model.tflite")
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
    print("Disease detection will not be available")
    interpreter = None
    input_details = None
    output_details = None
    model_loaded = False

# Ollama Setup (Optional - for enhanced information)
# Configure Ollama path and model name - set to None to disable
OLLAMA_BIN = None  # Set to r"C:\Users\tomie\AppData\Local\Programs\Ollama\ollama.exe" if Ollama is installed
OLLAMA_MODEL = "qwen3:4b"  # or "llama3:4b" or any other model you have

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess image for TFLite model - resize to 256x256 and normalize"""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((256, 256), Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def get_ollama_info(predicted: str, lang: str = "en") -> dict:
    """Get enhanced disease information from Ollama LLM (optional)"""
    if not OLLAMA_BIN or not os.path.exists(OLLAMA_BIN):
        return {}
    
    try:
        plant = predicted.split('_')[0]
        lang_map = {
            "en": "English",
            "hi": "Hindi",
            "ta": "Tamil",
            "gu": "Gujarati"
        }
        lang_name = lang_map.get(lang, "English")
        
        full_prompt = (
            f"Plant: {plant}\n"
            f"Disease: {predicted}\n\n"
            "Respond ONLY with a raw JSON object. Do not include explanations or extra text.\n"
            "The JSON must have these keys:\n"
            "  disease_type, symptoms, prevention, treatments, fertilizers, expected_yield\n"
            f"Please respond in {lang_name}."
        )
        
        proc = subprocess.run(
            [OLLAMA_BIN, "run", OLLAMA_MODEL, full_prompt],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            timeout=120
        )
        
        if proc.returncode == 0:
            llm_out = proc.stdout.strip()
            m = re.search(r"(\{.*\})", llm_out, re.DOTALL)
            if m:
                return json.loads(m.group(1))
    except Exception as e:
        app.logger.warning(f"Ollama call failed: {e}")
    
    return {}

@app.errorhandler(Exception)
def handle_exception(e):
    response = jsonify({"error": str(e)})
    response.status_code = 500
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response

@app.route('/')
def home():
    return "AI Backend is Running"

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json
#     # Example: assuming data contains "features"
#     features = np.array(data['features']).reshape(1, -1)

#     if model:
#         prediction = model.predict(features)
#         result = prediction.tolist()
#         return jsonify({'prediction': result})
#     else:
#         return jsonify({'error': 'Model not loaded'})

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    soil = data.get('soil_type', 'Unknown')
    pin = data.get('pin_code', '000000')
    # Mock temperature and crop recommendation logic
    temp = 25  # Example static temperature
    crop_rules = {
        'Loamy': ['Wheat', 'Sugarcane', 'Cotton'],
        'Sandy': ['Peanut', 'Watermelon', 'Potato'],
        'Clay': ['Rice', 'Soybean', 'Broccoli']
    }
    crops = crop_rules.get(soil, ['Maize', 'Barley'])
    rule = {"crops": crops}
    return jsonify({
        "temperature": temp,
        "soil": soil,
        "recommended_crops": rule["crops"],
        "source": "Generated by CropIQ"
    })

@app.route('/api/detect-soil', methods=['POST'])
def detect_soil():
    """Detect soil type from uploaded image"""
    try:
        # For now, return a mock soil type
        # In a real implementation, you would process the image with AI
        soil_types = ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty', 'Chalky']
        detected_soil = random.choice(soil_types)
        
        return jsonify({
            "soil_type": detected_soil,
            "confidence": 0.85,
            "message": "Soil type detected successfully"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommend-plants', methods=['POST'])
def recommend_plants():
    """Get plant recommendations based on soil type, location, temperature, temperature range, and season"""
    try:
        data = request.json
        soil_type = data.get('soil_type', 'Loamy')
        location = data.get('location', 'Unknown')
        temperature = data.get('temperature', 25)
        temperature_range = data.get('temperature_range', '')
        season = data.get('season', '')
        
        # Plant recommendation logic based on soil type, temperature, and location
        recommendations = []
        
        # Define climate zones based on location (simplified)
        def get_climate_zone(location_name):
            location_lower = location_name.lower()
            if any(zone in location_lower for zone in ['tropical', 'india', 'tamil nadu', 'tamilnadu', 'chennai', 'madurai', 'coimbatore', 'salem', 'trichy', 'vellore', 'brazil', 'thailand', 'indonesia', 'malaysia', 'kerala', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra', 'gujarat', 'rajasthan', 'delhi', 'punjab', 'haryana', 'uttar pradesh', 'bihar', 'west bengal', 'odisha', 'assam', 'nagaland', 'manipur', 'mizoram', 'tripura', 'meghalaya', 'arunachal pradesh', 'sikkim', 'himachal pradesh', 'uttarakhand', 'jharkhand', 'chhattisgarh', 'madhya pradesh']):
                return 'tropical'
            elif any(zone in location_lower for zone in ['subtropical', 'florida', 'california', 'australia', 'south africa']):
                return 'subtropical'
            elif any(zone in location_lower for zone in ['temperate', 'europe', 'north america', 'china', 'japan']):
                return 'temperate'
            elif any(zone in location_lower for zone in ['cold', 'canada', 'russia', 'scandinavia', 'alaska']):
                return 'cold'
            else:
                return 'temperate'  # default
        
        climate_zone = get_climate_zone(location)
        
        # Filter plants based on temperature range if provided
        def filter_by_temperature_range(plants, temp_range):
            if not temp_range:
                return plants
            
            temp_min, temp_max = map(int, temp_range.split('-'))
            filtered_plants = []
            
            # Define temperature preferences for common plants
            plant_temp_preferences = {
                'Rice': (20, 35), 'Wheat': (10, 25), 'Maize': (15, 30), 'Tomato': (18, 30),
                'Potato': (15, 25), 'Cotton': (20, 35), 'Sugarcane': (20, 35), 'Banana': (20, 35),
                'Mango': (20, 35), 'Coconut': (20, 35), 'Groundnut': (20, 35), 'Pulses': (15, 30),
                'Sunflower': (15, 30), 'Mustard': (10, 25), 'Chickpea': (15, 25), 'Soybean': (15, 30),
                'Pepper': (20, 30), 'Onion': (15, 25), 'Carrot': (10, 25), 'Broccoli': (10, 20),
                'Cabbage': (10, 20), 'Pea': (10, 20), 'Spinach': (5, 20), 'Beetroot': (10, 25),
                'Barley': (5, 20), 'Oats': (5, 20), 'Rye': (5, 20), 'Lavender': (15, 25),
                'Rosemary': (15, 25), 'Sage': (15, 25), 'Thyme': (15, 25), 'Mint': (10, 25),
                'Soybeans': (15, 30), 'Cauliflower': (10, 25), 'Peanuts': (20, 35), 'Watermelon': (20, 35),
                'Sweet Potatoes': (20, 35), 'Cassava': (20, 35), 'Pineapple': (20, 35), 'Tapioca': (20, 35), 'Corn': (15, 30)
            }
            
            for plant in plants:
                if plant in plant_temp_preferences:
                    plant_min, plant_max = plant_temp_preferences[plant]
                    # Check if temperature ranges overlap
                    if not (temp_max < plant_min or temp_min > plant_max):
                        filtered_plants.append(plant)
                else:
                    # If plant not in preferences, include it
                    filtered_plants.append(plant)
            
            return filtered_plants
        
        # Filter plants based on season if provided
        def filter_by_season(plants, season):
            if not season:
                return plants
            
            # Define seasonal preferences for common plants
            seasonal_plants = {
                'Spring': ['Rice', 'Wheat', 'Maize', 'Tomato', 'Potato', 'Pea', 'Spinach', 'Carrot', 'Broccoli', 'Cabbage', 'Cauliflower', 'Soybeans', 'Soybean', 'Peanuts', 'Watermelon', 'Sweet Potatoes', 'Cassava', 'Pineapple', 'Tapioca'],
                'Summer': ['Rice', 'Maize', 'Tomato', 'Cotton', 'Sugarcane', 'Banana', 'Mango', 'Coconut', 'Groundnut', 'Sunflower', 'Mustard', 'Pepper', 'Soybeans', 'Soybean', 'Peanuts', 'Watermelon', 'Sweet Potatoes', 'Cassava', 'Pineapple', 'Tapioca'],
                'Autumn': ['Wheat', 'Barley', 'Oats', 'Rye', 'Potato', 'Carrot', 'Beetroot', 'Spinach', 'Rice', 'Soybeans', 'Soybean', 'Broccoli', 'Cabbage', 'Cauliflower', 'Peanuts', 'Sweet Potatoes', 'Cassava', 'Tapioca'],
                'Winter': ['Wheat', 'Barley', 'Oats', 'Rye', 'Spinach', 'Broccoli', 'Cabbage', 'Pea', 'Cauliflower', 'Carrot', 'Sweet Potatoes', 'Cassava', 'Rice', 'Maize', 'Corn', 'Tomato', 'Cotton', 'Sugarcane', 'Banana', 'Mango', 'Coconut', 'Groundnut', 'Sunflower', 'Mustard', 'Pepper', 'Soybeans', 'Soybean', 'Peanuts', 'Watermelon', 'Pineapple', 'Tapioca'],
                'Year-round': ['Rice', 'Wheat', 'Maize', 'Tomato', 'Potato', 'Cotton', 'Sugarcane', 'Banana', 'Mango', 'Coconut', 'Groundnut', 'Pulses', 'Sunflower', 'Mustard', 'Chickpea', 'Soybean', 'Soybeans', 'Pepper', 'Onion', 'Broccoli', 'Cabbage', 'Cauliflower', 'Peanuts', 'Watermelon', 'Sweet Potatoes', 'Cassava', 'Pineapple', 'Tapioca']
            }
            
            if season in seasonal_plants:
                return [plant for plant in plants if plant in seasonal_plants[season]]
            else:
                return plants
        
        # Comprehensive plant recommendations based on soil type, temperature, and climate
        if soil_type == 'Loamy':  
            if climate_zone == 'tropical':
                if temperature > 25:
                    # Tamil Nadu specific recommendations for hot weather
                    if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower() or any(city in location.lower() for city in ['chennai', 'madurai', 'coimbatore', 'salem', 'trichy', 'vellore']):
                        recommendations = ['Rice', 'Sugarcane', 'Banana', 'Mango', 'Coconut', 'Tapioca', 'Groundnut', 'Pulses']
                    else:
                        recommendations = ['Rice', 'Sugarcane', 'Banana', 'Mango', 'Papaya', 'Coconut']
                else:
                    if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                        recommendations = ['Rice', 'Wheat', 'Maize', 'Pulses', 'Groundnut', 'Sunflower', 'Cotton']
                    else:
                        recommendations = ['Rice', 'Wheat', 'Corn', 'Soybeans', 'Peanuts']
            elif climate_zone == 'subtropical':
                if temperature > 20:
                    recommendations = ['Cotton', 'Sugarcane', 'Citrus', 'Avocado', 'Olives']
                else:
                    recommendations = ['Wheat', 'Barley', 'Oats', 'Peas', 'Lentils']
            elif climate_zone == 'temperate':
                if temperature > 15:
                    recommendations = ['Wheat', 'Corn', 'Soybeans', 'Sunflowers', 'Potatoes']
                else:
                    recommendations = ['Wheat', 'Barley', 'Oats', 'Rye', 'Peas']
            else:  # cold
                recommendations = ['Barley', 'Oats', 'Rye', 'Potatoes', 'Carrots']
                
        elif soil_type == 'Sandy':
            if climate_zone == 'tropical':
                if temperature > 25:
                    if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                        recommendations = ['Groundnut', 'Tapioca', 'Sweet Potato', 'Onion', 'Garlic', 'Chilli', 'Tomato']
                    else:
                        recommendations = ['Peanuts', 'Watermelon', 'Sweet Potatoes', 'Cassava', 'Pineapple']
                else:
                    if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                        recommendations = ['Groundnut', 'Potato', 'Onion', 'Garlic', 'Carrot', 'Radish']
                    else:
                        recommendations = ['Peanuts', 'Potatoes', 'Carrots', 'Onions', 'Garlic']
            elif climate_zone == 'subtropical':
                if temperature > 20:
                    recommendations = ['Peanuts', 'Watermelon', 'Cantaloupe', 'Sweet Corn', 'Tomatoes']
                else:
                    recommendations = ['Potatoes', 'Carrots', 'Radish', 'Turnips', 'Beets']
            elif climate_zone == 'temperate':
                if temperature > 15:
                    recommendations = ['Potatoes', 'Carrots', 'Onions', 'Garlic', 'Asparagus']
                else:
                    recommendations = ['Potatoes', 'Carrots', 'Radish', 'Turnips', 'Parsnips']
            else:  # cold
                recommendations = ['Potatoes', 'Carrots', 'Parsnips', 'Turnips', 'Radish']
                
        elif soil_type == 'Clay':
            if climate_zone == 'tropical':
                if temperature > 25:
                    if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                        recommendations = ['Rice', 'Sugarcane', 'Cotton', 'Pulses', 'Sunflower', 'Groundnut']
                    else:
                        recommendations = ['Rice', 'Soybeans', 'Cabbage', 'Cauliflower', 'Broccoli']
                else:
                    if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                        recommendations = ['Rice', 'Wheat', 'Pulses', 'Mustard', 'Sunflower']
                    else:
                        recommendations = ['Rice', 'Wheat', 'Barley', 'Mustard', 'Rapeseed']
            elif climate_zone == 'subtropical':
                if temperature > 20:
                    recommendations = ['Rice', 'Soybeans', 'Broccoli', 'Cabbage', 'Kale']
                else:
                    recommendations = ['Rice', 'Wheat', 'Barley', 'Mustard', 'Spinach']
            elif climate_zone == 'temperate':
                if temperature > 15:
                    recommendations = ['Rice', 'Soybeans', 'Broccoli', 'Cabbage', 'Cauliflower']
                else:
                    recommendations = ['Rice', 'Wheat', 'Barley', 'Mustard', 'Kale']
            else:  # cold
                recommendations = ['Rice', 'Wheat', 'Barley', 'Mustard', 'Spinach']
                
        elif soil_type == 'Silty':
            if climate_zone == 'tropical':
                if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                    recommendations = ['Rice', 'Maize', 'Pulses', 'Groundnut', 'Sunflower', 'Cotton']
                else:
                    recommendations = ['Corn', 'Soybeans', 'Wheat', 'Alfalfa', 'Clover']
            elif climate_zone == 'subtropical':
                recommendations = ['Corn', 'Soybeans', 'Wheat', 'Alfalfa', 'Sunflowers']
            elif climate_zone == 'temperate':
                recommendations = ['Corn', 'Soybeans', 'Wheat', 'Alfalfa', 'Clover']
            else:  # cold
                recommendations = ['Wheat', 'Barley', 'Oats', 'Alfalfa', 'Clover']
                
        elif soil_type == 'Peaty':
            if climate_zone == 'tropical':
                if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                    recommendations = ['Rice', 'Vegetables', 'Potato', 'Carrot', 'Onion', 'Garlic']
                else:
                    recommendations = ['Cranberries', 'Blueberries', 'Potatoes', 'Carrots', 'Celery']
            elif climate_zone == 'subtropical':
                recommendations = ['Blueberries', 'Strawberries', 'Potatoes', 'Carrots', 'Lettuce']
            elif climate_zone == 'temperate':
                recommendations = ['Cranberries', 'Blueberries', 'Potatoes', 'Carrots', 'Celery']
            else:  # cold
                recommendations = ['Cranberries', 'Blueberries', 'Potatoes', 'Carrots', 'Parsnips']
                
        elif soil_type == 'Chalky':
            if climate_zone == 'tropical':
                if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                    recommendations = ['Millets', 'Pulses', 'Oilseeds', 'Spices', 'Medicinal Plants']
                else:
                    recommendations = ['Lavender', 'Rosemary', 'Sage', 'Thyme', 'Oregano']
            elif climate_zone == 'subtropical':
                recommendations = ['Lavender', 'Rosemary', 'Sage', 'Thyme', 'Basil']
            elif climate_zone == 'temperate':
                recommendations = ['Lavender', 'Rosemary', 'Sage', 'Thyme', 'Oregano']
            else:  # cold
                recommendations = ['Lavender', 'Rosemary', 'Sage', 'Thyme', 'Mint']
        else:
            # Default recommendations
            if 'tamil nadu' in location.lower() or 'tamilnadu' in location.lower():
                recommendations = ['Rice', 'Wheat', 'Maize', 'Pulses', 'Groundnut', 'Sunflower']
            else:
                recommendations = ['Wheat', 'Barley', 'Oats', 'Corn', 'Soybeans']
        
        # Apply temperature range and season filters
        if temperature_range:
            recommendations = filter_by_temperature_range(recommendations, temperature_range)
        
        if season:
            recommendations = filter_by_season(recommendations, season)
        
        # Create message with filter information
        message_parts = [f"Recommended {len(recommendations)} plants for {soil_type} soil in {climate_zone} climate"]
        if temperature_range:
            message_parts.append(f"temperature range {temperature_range}°C")
        if season:
            message_parts.append(f"season {season}")
        
        message = ", ".join(message_parts)
        
        return jsonify({
            "recommendations": recommendations,
            "soil_type": soil_type,
            "location": location,
            "climate_zone": climate_zone,
            "temperature": temperature,
            "temperature_range": temperature_range,
            "season": season,
            "message": message
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/fertilizer-recommendation', methods=['POST'])
def fertilizer_recommendation():
    """Get fertilizer NPK recommendations using ML models"""
    try:
        data = request.json
        plant_type = data.get('plant_type', '').strip()
        growth_stage = data.get('growth_stage', '').strip()
        temperature = data.get('temperature', 25)
        soil_type = data.get('soil_type', '').strip()
        
        if not all([plant_type, growth_stage, soil_type]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Try ML prediction first
        ml_prediction = fertilizer_predictor.predict_npk(plant_type, growth_stage, soil_type, temperature)
        
        if ml_prediction:
            # Use ML prediction
            final_n = ml_prediction['nitrogen']
            final_p = ml_prediction['phosphorus']
            final_k = ml_prediction['potassium']
            
            # Calculate application rate based on NPK values
            final_rate = int((final_n + final_p + final_k) * 2.5)  # Convert to kg/hectare
            
            recommendations = [
                f"ML Model Prediction: N-{final_n}, P-{final_p}, K-{final_k}",
                "Apply fertilizer in early morning or evening",
                "Ensure adequate watering after application"
            ]
            
            # Add soil-specific recommendations
            if soil_type == 'Sandy':
                recommendations.append("Apply fertilizer in smaller, more frequent doses")
                recommendations.append("Consider adding organic matter to improve nutrient retention")
            elif soil_type == 'Clay':
                recommendations.append("Clay soil retains nutrients well - reduce application frequency")
                recommendations.append("Ensure good drainage to prevent waterlogging")
            elif soil_type == 'Peaty':
                recommendations.append("Peaty soils are naturally rich - monitor for over-fertilization")
                recommendations.append("Focus on phosphorus and potassium supplementation")
            
            notes = f"ML-based recommendations for {plant_type} in {growth_stage} stage. "
            notes += f"Temperature: {temperature}°C, Soil: {soil_type}. "
            notes += f"Application rate: {final_rate} kg per hectare. "
            notes += "Model accuracy: N-96.7%, P-97.6%, K-98.3%"
            
            return jsonify({
                "plant_type": plant_type,
                "growth_stage": growth_stage,
                "temperature": temperature,
                "soil_type": soil_type,
                "npk_ratio": {
                    "N": final_n,
                    "P": final_p,
                    "K": final_k
                },
                "application_rate": f"Apply {final_rate} kg per hectare",
                "recommendations": recommendations,
                "notes": notes,
                "source": "ML-Powered Fertilizer Recommendation System",
                "model_accuracy": fertilizer_predictor.get_model_info()['performance']
            })
        
        else:
            # Fallback to rule-based system if ML fails
            return jsonify({'error': 'ML model not available, please check model files'}), 500
        
    except Exception as e:
        import traceback
        print(f"Error in fertilizer recommendation: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Error generating recommendation: {str(e)}'}), 500
        fertilizer_rules = {
            'Rice': {
                'Seedling': {'N': 20, 'P': 15, 'K': 10, 'base_rate': 80},
                'Vegetative': {'N': 30, 'P': 20, 'K': 15, 'base_rate': 120},
                'Flowering': {'N': 25, 'P': 25, 'K': 20, 'base_rate': 100},
                'Fruiting': {'N': 15, 'P': 20, 'K': 25, 'base_rate': 80},
                'Maturity': {'N': 10, 'P': 20, 'K': 30, 'base_rate': 60}
            },
            'Wheat': {
                'Seedling': {'N': 25, 'P': 20, 'K': 10, 'base_rate': 90},
                'Vegetative': {'N': 35, 'P': 25, 'K': 15, 'base_rate': 130},
                'Flowering': {'N': 20, 'P': 30, 'K': 25, 'base_rate': 110},
                'Fruiting': {'N': 20, 'P': 25, 'K': 30, 'base_rate': 100},
                'Maturity': {'N': 0, 'P': 0, 'K': 0, 'base_rate': 0}
            },
            'Maize': {
                'Seedling': {'N': 30, 'P': 15, 'K': 10, 'base_rate': 100},
                'Vegetative': {'N': 40, 'P': 20, 'K': 15, 'base_rate': 150},
                'Flowering': {'N': 20, 'P': 25, 'K': 20, 'base_rate': 120},
                'Fruiting': {'N': 10, 'P': 20, 'K': 25, 'base_rate': 90},
                'Maturity': {'N': 0, 'P': 20, 'K': 30, 'base_rate': 50}
            },
            'Tomato': {
                'Seedling': {'N': 20, 'P': 25, 'K': 15, 'base_rate': 60},
                'Vegetative': {'N': 30, 'P': 20, 'K': 20, 'base_rate': 100},
                'Flowering': {'N': 25, 'P': 30, 'K': 25, 'base_rate': 120},
                'Fruiting': {'N': 20, 'P': 25, 'K': 30, 'base_rate': 140},
                'Maturity': {'N': 15, 'P': 20, 'K': 25, 'base_rate': 80}
            },
            'Potato': {
                'Seedling': {'N': 25, 'P': 20, 'K': 15, 'base_rate': 80},
                'Vegetative': {'N': 30, 'P': 25, 'K': 20, 'base_rate': 120},
                'Flowering': {'N': 20, 'P': 30, 'K': 25, 'base_rate': 100},
                'Fruiting': {'N': 15, 'P': 25, 'K': 30, 'base_rate': 90},
                'Maturity': {'N': 10, 'P': 20, 'K': 25, 'base_rate': 60}
            },
            'Cotton': {
                'Seedling': {'N': 20, 'P': 15, 'K': 10, 'base_rate': 70},
                'Vegetative': {'N': 35, 'P': 20, 'K': 15, 'base_rate': 130},
                'Flowering': {'N': 30, 'P': 25, 'K': 20, 'base_rate': 150},
                'Fruiting': {'N': 15, 'P': 20, 'K': 25, 'base_rate': 100},
                'Maturity': {'N': 0, 'P': 15, 'K': 30, 'base_rate': 50}
            },
            'Soybean': {
                'Seedling': {'N': 10, 'P': 25, 'K': 15, 'base_rate': 60},
                'Vegetative': {'N': 15, 'P': 30, 'K': 20, 'base_rate': 90},
                'Flowering': {'N': 20, 'P': 25, 'K': 25, 'base_rate': 100},
                'Fruiting': {'N': 15, 'P': 20, 'K': 30, 'base_rate': 80},
                'Maturity': {'N': 0, 'P': 15, 'K': 25, 'base_rate': 40}
            },
            'Peanut': {
                'Seedling': {'N': 15, 'P': 20, 'K': 15, 'base_rate': 50},
                'Vegetative': {'N': 20, 'P': 25, 'K': 20, 'base_rate': 80},
                'Flowering': {'N': 15, 'P': 30, 'K': 25, 'base_rate': 90},
                'Fruiting': {'N': 10, 'P': 25, 'K': 30, 'base_rate': 70},
                'Maturity': {'N': 0, 'P': 20, 'K': 25, 'base_rate': 40}
            },
            'Sugarcane': {
                'Seedling': {'N': 25, 'P': 15, 'K': 10, 'base_rate': 100},
                'Vegetative': {'N': 40, 'P': 20, 'K': 15, 'base_rate': 200},
                'Flowering': {'N': 30, 'P': 25, 'K': 20, 'base_rate': 180},
                'Fruiting': {'N': 20, 'P': 20, 'K': 25, 'base_rate': 150},
                'Maturity': {'N': 15, 'P': 15, 'K': 30, 'base_rate': 120}
            },
            'Banana': {
                'Seedling': {'N': 30, 'P': 20, 'K': 25, 'base_rate': 120},
                'Vegetative': {'N': 35, 'P': 25, 'K': 30, 'base_rate': 180},
                'Flowering': {'N': 25, 'P': 30, 'K': 35, 'base_rate': 200},
                'Fruiting': {'N': 20, 'P': 25, 'K': 40, 'base_rate': 160},
                'Maturity': {'N': 15, 'P': 20, 'K': 35, 'base_rate': 100}
            },
            'Mango': {
                'Seedling': {'N': 25, 'P': 20, 'K': 20, 'base_rate': 100},
                'Vegetative': {'N': 30, 'P': 25, 'K': 25, 'base_rate': 150},
                'Flowering': {'N': 20, 'P': 30, 'K': 30, 'base_rate': 120},
                'Fruiting': {'N': 25, 'P': 25, 'K': 35, 'base_rate': 180},
                'Maturity': {'N': 20, 'P': 20, 'K': 30, 'base_rate': 100}
            },
            'Coconut': {
                'Seedling': {'N': 20, 'P': 25, 'K': 30, 'base_rate': 80},
                'Vegetative': {'N': 25, 'P': 30, 'K': 35, 'base_rate': 120},
                'Flowering': {'N': 20, 'P': 25, 'K': 40, 'base_rate': 100},
                'Fruiting': {'N': 25, 'P': 20, 'K': 45, 'base_rate': 140},
                'Maturity': {'N': 20, 'P': 15, 'K': 40, 'base_rate': 100}
            },
            'Groundnut': {
                'Seedling': {'N': 10, 'P': 20, 'K': 15, 'base_rate': 40},
                'Vegetative': {'N': 15, 'P': 25, 'K': 20, 'base_rate': 70},
                'Flowering': {'N': 20, 'P': 30, 'K': 25, 'base_rate': 90},
                'Fruiting': {'N': 15, 'P': 25, 'K': 30, 'base_rate': 80},
                'Maturity': {'N': 0, 'P': 20, 'K': 25, 'base_rate': 40}
            },
            'Sunflower': {
                'Seedling': {'N': 20, 'P': 15, 'K': 10, 'base_rate': 60},
                'Vegetative': {'N': 30, 'P': 20, 'K': 15, 'base_rate': 100},
                'Flowering': {'N': 25, 'P': 25, 'K': 20, 'base_rate': 120},
                'Fruiting': {'N': 20, 'P': 20, 'K': 25, 'base_rate': 100},
                'Maturity': {'N': 5, 'P': 15, 'K': 30, 'base_rate': 50}
            },
            'Mustard': {
                'Seedling': {'N': 25, 'P': 20, 'K': 15, 'base_rate': 70},
                'Vegetative': {'N': 35, 'P': 25, 'K': 20, 'base_rate': 120},
                'Flowering': {'N': 30, 'P': 30, 'K': 25, 'base_rate': 140},
                'Fruiting': {'N': 20, 'P': 25, 'K': 30, 'base_rate': 100},
                'Maturity': {'N': 0, 'P': 20, 'K': 25, 'base_rate': 40}
            },
            'Pulses': {
                'Seedling': {'N': 10, 'P': 25, 'K': 15, 'base_rate': 50},
                'Vegetative': {'N': 15, 'P': 30, 'K': 20, 'base_rate': 80},
                'Flowering': {'N': 20, 'P': 25, 'K': 25, 'base_rate': 100},
                'Fruiting': {'N': 15, 'P': 20, 'K': 30, 'base_rate': 80},
                'Maturity': {'N': 0, 'P': 15, 'K': 25, 'base_rate': 40}
            }
        }
        
        # Get base NPK ratios for the plant and growth stage
        if plant_type not in fertilizer_rules:
            return jsonify({'error': f'Plant type "{plant_type}" not supported'}), 400
        
        if growth_stage not in fertilizer_rules[plant_type]:
            return jsonify({'error': f'Growth stage "{growth_stage}" not supported for {plant_type}'}), 400
        
        base_ratios = fertilizer_rules[plant_type][growth_stage]
        
        # Temperature adjustments
        temp_adjustment = 1.0
        if temperature < 10:
            temp_adjustment = 0.7  # Reduce fertilizer in cold weather
        elif temperature > 35:
            temp_adjustment = 0.8  # Reduce fertilizer in hot weather
        elif 20 <= temperature <= 30:
            temp_adjustment = 1.1  # Optimal temperature range
        
        # Soil type adjustments
        soil_adjustments = {
            'Sandy': {'N': 1.2, 'P': 1.1, 'K': 1.3},  # Sandy soils need more nutrients
            'Loamy': {'N': 1.0, 'P': 1.0, 'K': 1.0},  # Optimal soil
            'Clay': {'N': 0.9, 'P': 0.9, 'K': 0.8},   # Clay retains nutrients better
            'Silty': {'N': 1.0, 'P': 1.0, 'K': 1.0},   # Similar to loamy
            'Peaty': {'N': 0.8, 'P': 1.2, 'K': 0.9},  # Peaty soils are rich in organic matter
            'Chalky': {'N': 1.1, 'P': 0.8, 'K': 1.1}  # Chalky soils are alkaline
        }
        
        soil_adj = soil_adjustments.get(soil_type, {'N': 1.0, 'P': 1.0, 'K': 1.0})
        
        # Calculate final NPK ratios as whole numbers
        final_n = round(base_ratios['N'] * temp_adjustment * soil_adj['N'])
        final_p = round(base_ratios['P'] * temp_adjustment * soil_adj['P'])
        final_k = round(base_ratios['K'] * temp_adjustment * soil_adj['K'])
        
        # Ensure minimum values of 1 for display purposes
        final_n = max(1, final_n)
        final_p = max(1, final_p)
        final_k = max(1, final_k)
        
        # Calculate application rate
        base_rate = base_ratios['base_rate']
        final_rate = round(base_rate * temp_adjustment, 1)
        
        # Generate recommendations based on conditions
        recommendations = []
        
        # Growth stage specific recommendations
        if growth_stage == 'Seedling':
            recommendations.append("Apply fertilizer in small amounts to avoid burning young roots")
            recommendations.append("Use water-soluble fertilizers for better absorption")
        elif growth_stage == 'Vegetative':
            recommendations.append("Focus on nitrogen-rich fertilizers for leaf and stem growth")
            recommendations.append("Apply fertilizer every 2-3 weeks during active growth")
        elif growth_stage == 'Flowering':
            recommendations.append("Increase phosphorus for better flower formation")
            recommendations.append("Reduce nitrogen to prevent excessive vegetative growth")
        elif growth_stage == 'Fruiting':
            recommendations.append("Emphasize potassium for fruit development and quality")
            recommendations.append("Apply fertilizer before fruit set for best results")
        
        # Temperature specific recommendations
        if temperature < 15:
            recommendations.append("Reduce fertilizer application in cold weather")
            recommendations.append("Consider using slow-release fertilizers")
        elif temperature > 30:
            recommendations.append("Increase watering frequency to prevent fertilizer burn")
            recommendations.append("Apply fertilizer in early morning or evening")
        
        # Soil specific recommendations
        if soil_type == 'Sandy':
            recommendations.append("Apply fertilizer in smaller, more frequent doses")
            recommendations.append("Consider adding organic matter to improve nutrient retention")
        elif soil_type == 'Clay':
            recommendations.append("Clay soil retains nutrients well - reduce application frequency")
            recommendations.append("Ensure good drainage to prevent waterlogging")
        elif soil_type == 'Peaty':
            recommendations.append("Peaty soils are naturally rich - monitor for over-fertilization")
            recommendations.append("Focus on phosphorus and potassium supplementation")
        
        # Generate notes
        notes = f"Recommendations for {plant_type} in {growth_stage} stage. "
        notes += f"Temperature: {temperature}°C, Soil: {soil_type}. "
        notes += f"Application rate: {final_rate} kg per hectare. "
        notes += "Always conduct soil tests before major fertilizer applications and adjust based on local conditions."
        
        return jsonify({
            "plant_type": plant_type,
            "growth_stage": growth_stage,
            "temperature": temperature,
            "soil_type": soil_type,
            "npk_ratio": {
                "N": final_n,
                "P": final_p,
                "K": final_k
            },
            "application_rate": f"Apply {final_rate} kg per hectare",
            "recommendations": recommendations,
            "notes": notes,
            "source": "Smart Fertilizer Recommendation System"
        })
        
    except Exception as e:
        import traceback
        print(f"Error in fertilizer recommendation: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Error generating recommendation: {str(e)}'}), 500

@app.route('/api/detect-disease', methods=['POST'])
def detect_disease():
    """Detect disease from uploaded leaf image using TFLite model"""
    if not model_loaded:
        return jsonify({'error': 'Model not loaded - TFLite model file not found or failed to load'}), 500
    
    if 'leaf' not in request.files:
        return jsonify({'error': 'No leaf image uploaded'}), 400
    
    try:
        file = request.files['leaf']
        lang = request.form.get('lang', 'en') if request.form else 'en'
        
        # Read image bytes
        img_bytes = file.read()
        
        # Validate that the file is an image
        try:
            img = Image.open(io.BytesIO(img_bytes))
            img.verify()  # Verify it's actually an image
        except Exception as img_error:
            return jsonify({'error': 'Invalid image file'}), 400
        
        # Preprocess image for TFLite model (256x256)
        data = preprocess_image(img_bytes)
        
        # Run TFLite inference
        interpreter.set_tensor(input_details["index"], data)
        interpreter.invoke()
        raw_output = interpreter.get_tensor(output_details["index"])
        out = np.array(raw_output).flatten()
        
        if out.shape[0] != len(CLASS_NAMES):
            return jsonify({
                "error": "Model output length mismatch",
                "output_len": int(out.shape[0]),
                "num_classes": len(CLASS_NAMES)
            }), 500
        
        # Get top prediction and top 3
        top_idx = int(np.argmax(out))
        top3_idx = np.argsort(out)[-3:][::-1]
        top3 = [{"label": CLASS_NAMES[i], "score": float(out[i] * 100)} for i in top3_idx]
        
        predicted = CLASS_NAMES[top_idx]
        confidence = float(out[top_idx] * 100)
        
        # Determine if healthy
        is_healthy = 'healthy' in predicted.lower()
        
        # Get enhanced information from Ollama (optional)
        ollama_info = get_ollama_info(predicted, lang) if OLLAMA_BIN else {}
        
        # Create user-friendly disease name
        disease_display = predicted.replace('_', ' ').title()
        if 'Healthy' in disease_display:
            result_message = "No disease detected - Plant appears healthy"
            disease_status = "Healthy"
        else:
            result_message = f"Disease detected: {disease_display}"
            disease_status = disease_display

        # Build response
        response = {
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
        }
        
        # Add Ollama information if available
        if ollama_info:
            response.update({
                "disease_type": ollama_info.get("disease_type", ""),
                "symptoms": ollama_info.get("symptoms", ""),
                "prevention": ollama_info.get("prevention", ""),
                "treatments": ollama_info.get("treatments", ""),
                "fertilizers": ollama_info.get("fertilizers", ""),
                "expected_yield": ollama_info.get("expected_yield", "")
            })
        
        return jsonify(response)
    except Exception as e:
        import traceback
        print(f"Error in disease detection: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
