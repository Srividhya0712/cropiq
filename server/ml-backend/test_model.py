#!/usr/bin/env python3
"""
Test the disease detection model to identify issues with healthy leaf detection
"""

import tensorflow as tf
import numpy as np
from PIL import Image
import os

def test_model():
    print("=== TESTING DISEASE DETECTION MODEL ===")
    
    try:
        # Load model
        model = tf.keras.models.load_model("leaf_disease_model.h5")
        print("✅ Model loaded successfully!")
        
        class_names = ["Apple Scab", "Apple Rust", "Corn Blight", "Healthy", "Tomato Bacterial Spot"]
        print(f"Class Names: {class_names}")
        print(f"Healthy class index: {class_names.index('Healthy')}")
        
        # Test with healthy image
        healthy_image_path = "data/healthy/sample_000.jpg"
        
        if os.path.exists(healthy_image_path):
            print(f"\nTesting with healthy image: {healthy_image_path}")
            
            # Load and preprocess image
            img = Image.open(healthy_image_path).resize((224, 224))
            img_array = np.expand_dims(np.array(img)/255.0, axis=0)
            
            print(f"Image shape: {img_array.shape}")
            print(f"Image min/max: {img_array.min():.3f}/{img_array.max():.3f}")
            
            # Make prediction
            predictions = model.predict(img_array)
            print(f"Raw predictions: {predictions}")
            
            # Get class index and confidence
            class_index = np.argmax(predictions)
            confidence = float(np.max(predictions))
            
            print(f"Predicted class index: {class_index}")
            print(f"Predicted class: {class_names[class_index]}")
            print(f"Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
            
            # Check all class probabilities
            print("\nAll class probabilities:")
            for i, (class_name, prob) in enumerate(zip(class_names, predictions[0])):
                print(f"  {i}: {class_name}: {prob:.4f} ({prob*100:.2f}%)")
            
            # Check if healthy is correctly predicted
            if class_names[class_index] == "Healthy":
                print("✅ SUCCESS: Model correctly predicts healthy leaf!")
            else:
                print("❌ PROBLEM: Model does NOT predict healthy leaf!")
                print(f"   Expected: Healthy")
                print(f"   Got: {class_names[class_index]}")
                
        else:
            print(f"❌ Healthy image not found: {healthy_image_path}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_model()

