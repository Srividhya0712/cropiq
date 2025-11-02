#!/usr/bin/env python3
"""
Quick Fertilizer Recommendation Model Training
Creates a machine learning model for NPK fertilizer recommendations
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import json

def create_fertilizer_dataset():
    """Create comprehensive fertilizer training dataset"""
    print("Creating fertilizer training dataset...")
    
    # Plant types and their characteristics
    plants = {
        'Rice': {'type': 'grain', 'nitrogen_need': 'high', 'phosphorus_need': 'medium', 'potassium_need': 'medium'},
        'Wheat': {'type': 'grain', 'nitrogen_need': 'high', 'phosphorus_need': 'medium', 'potassium_need': 'low'},
        'Maize': {'type': 'grain', 'nitrogen_need': 'very_high', 'phosphorus_need': 'medium', 'potassium_need': 'medium'},
        'Tomato': {'type': 'fruiting', 'nitrogen_need': 'medium', 'phosphorus_need': 'medium', 'potassium_need': 'high'},
        'Potato': {'type': 'tuber', 'nitrogen_need': 'medium', 'phosphorus_need': 'high', 'potassium_need': 'high'},
        'Cotton': {'type': 'fiber', 'nitrogen_need': 'high', 'phosphorus_need': 'medium', 'potassium_need': 'medium'},
        'Sugarcane': {'type': 'cash_crop', 'nitrogen_need': 'very_high', 'phosphorus_need': 'medium', 'potassium_need': 'high'},
        'Banana': {'type': 'fruit', 'nitrogen_need': 'high', 'phosphorus_need': 'medium', 'potassium_need': 'very_high'},
        'Mango': {'type': 'fruit', 'nitrogen_need': 'medium', 'phosphorus_need': 'medium', 'potassium_need': 'high'},
        'Coconut': {'type': 'tree', 'nitrogen_need': 'medium', 'phosphorus_need': 'high', 'potassium_need': 'high'},
        'Groundnut': {'type': 'legume', 'nitrogen_need': 'low', 'phosphorus_need': 'medium', 'potassium_need': 'medium'},
        'Soybean': {'type': 'legume', 'nitrogen_need': 'low', 'phosphorus_need': 'medium', 'potassium_need': 'medium'},
        'Sunflower': {'type': 'oilseed', 'nitrogen_need': 'medium', 'phosphorus_need': 'high', 'potassium_need': 'medium'},
        'Chickpea': {'type': 'legume', 'nitrogen_need': 'low', 'phosphorus_need': 'medium', 'potassium_need': 'low'},
        'Pepper': {'type': 'spice', 'nitrogen_need': 'medium', 'phosphorus_need': 'medium', 'potassium_need': 'high'},
        'Onion': {'type': 'vegetable', 'nitrogen_need': 'medium', 'phosphorus_need': 'high', 'potassium_need': 'medium'},
        'Pulses': {'type': 'legume', 'nitrogen_need': 'low', 'phosphorus_need': 'medium', 'potassium_need': 'medium'}
    }
    
    # Growth stages
    stages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity']
    
    # Soil types
    soil_types = ['Sandy', 'Loamy', 'Clay', 'Silty', 'Peaty', 'Chalky']
    
    # Generate training data
    data = []
    
    for plant, characteristics in plants.items():
        for stage in stages:
            for soil in soil_types:
                for temp in range(10, 41, 5):  # Temperature range
                    # Calculate NPK based on plant characteristics and conditions
                    n_base = {'very_low': 5, 'low': 10, 'medium': 20, 'high': 30, 'very_high': 40}[characteristics['nitrogen_need']]
                    p_base = {'very_low': 5, 'low': 10, 'medium': 20, 'high': 30, 'very_high': 40}[characteristics['phosphorus_need']]
                    k_base = {'very_low': 5, 'low': 10, 'medium': 20, 'high': 30, 'very_high': 40}[characteristics['potassium_need']]
                    
                    # Adjust for growth stage
                    stage_multipliers = {
                        'Seedling': {'N': 0.8, 'P': 1.2, 'K': 0.8},
                        'Vegetative': {'N': 1.2, 'P': 1.0, 'K': 0.9},
                        'Flowering': {'N': 1.0, 'P': 1.3, 'K': 1.1},
                        'Fruiting': {'N': 0.9, 'P': 1.1, 'K': 1.3},
                        'Maturity': {'N': 0.6, 'P': 1.0, 'K': 1.2}
                    }
                    
                    # Adjust for temperature
                    temp_multiplier = 1.0
                    if temp < 15:
                        temp_multiplier = 0.8
                    elif temp > 35:
                        temp_multiplier = 0.9
                    elif 20 <= temp <= 30:
                        temp_multiplier = 1.1
                    
                    # Adjust for soil type
                    soil_multipliers = {
                        'Sandy': {'N': 1.2, 'P': 1.1, 'K': 1.3},
                        'Loamy': {'N': 1.0, 'P': 1.0, 'K': 1.0},
                        'Clay': {'N': 0.9, 'P': 0.9, 'K': 0.8},
                        'Silty': {'N': 1.0, 'P': 1.0, 'K': 1.0},
                        'Peaty': {'N': 0.8, 'P': 1.2, 'K': 0.9},
                        'Chalky': {'N': 1.1, 'P': 0.8, 'K': 1.1}
                    }
                    
                    # Calculate final NPK
                    multiplier = stage_multipliers[stage]
                    soil_mult = soil_multipliers[soil]
                    
                    n_final = int(n_base * multiplier['N'] * temp_multiplier * soil_mult['N'])
                    p_final = int(p_base * multiplier['P'] * temp_multiplier * soil_mult['P'])
                    k_final = int(k_base * multiplier['K'] * temp_multiplier * soil_mult['K'])
                    
                    data.append({
                        'plant': plant,
                        'stage': stage,
                        'soil_type': soil,
                        'temperature': temp,
                        'nitrogen': n_final,
                        'phosphorus': p_final,
                        'potassium': k_final
                    })
    
    return pd.DataFrame(data)

def train_fertilizer_model():
    """Train the fertilizer recommendation model"""
    print("Training fertilizer recommendation model...")
    
    # Create dataset
    df = create_fertilizer_dataset()
    print(f"Created dataset with {len(df)} samples")
    
    # Encode categorical variables
    le_plant = LabelEncoder()
    le_stage = LabelEncoder()
    le_soil = LabelEncoder()
    
    df['plant_encoded'] = le_plant.fit_transform(df['plant'])
    df['stage_encoded'] = le_stage.fit_transform(df['stage'])
    df['soil_encoded'] = le_soil.fit_transform(df['soil_type'])
    
    # Prepare features and targets
    X = df[['plant_encoded', 'stage_encoded', 'soil_encoded', 'temperature']]
    y_n = df['nitrogen']
    y_p = df['phosphorus']
    y_k = df['potassium']
    
    # Split data
    X_train, X_test, y_n_train, y_n_test = train_test_split(X, y_n, test_size=0.2, random_state=42)
    _, _, y_p_train, y_p_test = train_test_split(X, y_p, test_size=0.2, random_state=42)
    _, _, y_k_train, y_k_test = train_test_split(X, y_k, test_size=0.2, random_state=42)
    
    # Train models for each nutrient
    print("Training Nitrogen prediction model...")
    model_n = RandomForestRegressor(n_estimators=100, random_state=42)
    model_n.fit(X_train, y_n_train)
    
    print("Training Phosphorus prediction model...")
    model_p = RandomForestRegressor(n_estimators=100, random_state=42)
    model_p.fit(X_train, y_p_train)
    
    print("Training Potassium prediction model...")
    model_k = RandomForestRegressor(n_estimators=100, random_state=42)
    model_k.fit(X_train, y_k_train)
    
    # Evaluate models
    n_score = model_n.score(X_test, y_n_test)
    p_score = model_p.score(X_test, y_p_test)
    k_score = model_k.score(X_test, y_k_test)
    
    print(f"Model Performance:")
    print(f"   Nitrogen R2: {n_score:.3f}")
    print(f"   Phosphorus R2: {p_score:.3f}")
    print(f"   Potassium R2: {k_score:.3f}")
    
    # Save models and encoders
    joblib.dump(model_n, 'fertilizer_nitrogen_model.pkl')
    joblib.dump(model_p, 'fertilizer_phosphorus_model.pkl')
    joblib.dump(model_k, 'fertilizer_potassium_model.pkl')
    
    joblib.dump(le_plant, 'plant_encoder.pkl')
    joblib.dump(le_stage, 'stage_encoder.pkl')
    joblib.dump(le_soil, 'soil_encoder.pkl')
    
    # Save metadata
    metadata = {
        'plants': le_plant.classes_.tolist(),
        'stages': le_stage.classes_.tolist(),
        'soils': le_soil.classes_.tolist(),
        'performance': {
            'nitrogen_r2': float(n_score),
            'phosphorus_r2': float(p_score),
            'potassium_r2': float(k_score)
        }
    }
    
    with open('fertilizer_model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("Fertilizer models saved successfully!")
    print("Files created:")
    print("   - fertilizer_nitrogen_model.pkl")
    print("   - fertilizer_phosphorus_model.pkl") 
    print("   - fertilizer_potassium_model.pkl")
    print("   - plant_encoder.pkl")
    print("   - stage_encoder.pkl")
    print("   - soil_encoder.pkl")
    print("   - fertilizer_model_metadata.json")
    
    return model_n, model_p, model_k, le_plant, le_stage, le_soil

if __name__ == "__main__":
    train_fertilizer_model()
