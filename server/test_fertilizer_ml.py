#!/usr/bin/env python3
"""
Quick test script to verify fertilizer ML models are working
"""

from fertilizer_ml import fertilizer_predictor

def test_fertilizer_models():
    print("Testing fertilizer ML models...")
    
    # Test model loading
    if fertilizer_predictor.models_loaded:
        print("Models loaded successfully!")
        
        # Test prediction
        prediction = fertilizer_predictor.predict_npk(
            plant_type="Tomato",
            growth_stage="Vegetative", 
            soil_type="Loamy",
            temperature=25
        )
        
        if prediction:
            print("Prediction successful!")
            print(f"NPK Recommendation: N-{prediction['nitrogen']}, P-{prediction['phosphorus']}, K-{prediction['potassium']}")
            
            # Test model info
            info = fertilizer_predictor.get_model_info()
            print(f"Model Performance: {info['performance']}")
            
        else:
            print("Prediction failed!")
    else:
        print("Models not loaded!")

if __name__ == "__main__":
    test_fertilizer_models()
