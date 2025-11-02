#!/usr/bin/env python3
"""
Fertilizer ML Model Integration
Loads trained models and provides ML-based NPK predictions
"""

import joblib
import json
import numpy as np

class FertilizerMLPredictor:
    def __init__(self):
        """Load trained fertilizer models"""
        try:
            self.model_n = joblib.load('fertilizer_nitrogen_model.pkl')
            self.model_p = joblib.load('fertilizer_phosphorus_model.pkl')
            self.model_k = joblib.load('fertilizer_potassium_model.pkl')
            
            self.plant_encoder = joblib.load('plant_encoder.pkl')
            self.stage_encoder = joblib.load('stage_encoder.pkl')
            self.soil_encoder = joblib.load('soil_encoder.pkl')
            
            with open('fertilizer_model_metadata.json', 'r') as f:
                self.metadata = json.load(f)
            
            self.models_loaded = True
            print("Fertilizer ML models loaded successfully!")
            
        except Exception as e:
            print(f"Error loading fertilizer models: {e}")
            self.models_loaded = False
    
    def predict_npk(self, plant_type, growth_stage, soil_type, temperature):
        """Predict NPK values using trained ML models"""
        if not self.models_loaded:
            return None
        
        try:
            # Encode categorical variables
            plant_encoded = self.plant_encoder.transform([plant_type])[0]
            stage_encoded = self.stage_encoder.transform([growth_stage])[0]
            soil_encoded = self.soil_encoder.transform([soil_type])[0]
            
            # Prepare input features
            features = np.array([[plant_encoded, stage_encoded, soil_encoded, temperature]])
            
            # Make predictions
            n_pred = int(self.model_n.predict(features)[0])
            p_pred = int(self.model_p.predict(features)[0])
            k_pred = int(self.model_k.predict(features)[0])
            
            return {
                'nitrogen': max(0, n_pred),  # Ensure non-negative
                'phosphorus': max(0, p_pred),
                'potassium': max(0, k_pred)
            }
            
        except Exception as e:
            print(f"Error in NPK prediction: {e}")
            return None
    
    def get_model_info(self):
        """Get model performance information"""
        if not self.models_loaded:
            return None
        
        return {
            'models_loaded': True,
            'performance': self.metadata['performance'],
            'supported_plants': self.metadata['plants'],
            'supported_stages': self.metadata['stages'],
            'supported_soils': self.metadata['soils']
        }

# Global predictor instance
fertilizer_predictor = FertilizerMLPredictor()
