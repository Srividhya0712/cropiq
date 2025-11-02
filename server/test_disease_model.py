#!/usr/bin/env python3
"""
Test the disease detection model to identify issues with healthy leaf detection
"""

import tensorflow as tf
import numpy as np
from PIL import Image
import os

def test_model_loading():
    print("=== TESTING MODEL LOADING ===")
    
    try:
        model = tf.keras.models.load_model("leaf_disease_model.h5")
        print("✅ Model loaded successfully!")
        
        # Check model summary
        print("\nModel Summary:")
        model.summary()
        
        # Check class names
        class_names = ["Apple Scab", "Apple Rust", "Corn Blight", "Healthy", "Tomato Bacterial Spot"]
        print(f"\nClass Names: {class_names}")
        print(f"Healthy class index: {class_names.index('Healthy')}")
        
        return model, class_names
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None, None

def test_healthy_image_prediction(model, class_names):
    print("\n=== TESTING HEALTHY IMAGE PREDICTION ===")
    
    # Test with a healthy image from the dataset
    healthy_image_path = "data/healthy/sample_000.jpg"
    
    if os.path.exists(healthy_image_path):
        try:
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
            
            return class_index, confidence
            
        except Exception as e:
            print(f"❌ Error processing healthy image: {e}")
            return None, None
    else:
        print(f"❌ Healthy image not found: {healthy_image_path}")
        return None, None

def test_model_with_different_images(model, class_names):
    print("\n=== TESTING MODEL WITH DIFFERENT IMAGES ===")
    
    # Test with images from each class
    test_images = [
        ("data/healthy/sample_000.jpg", "Healthy"),
        ("data/apple_scab/sample_000.jpg", "Apple Scab"),
        ("data/apple_rust/sample_000.jpg", "Apple Rust"),
        ("data/corn_blight/sample_000.jpg", "Corn Blight"),
        ("data/tomato_bacterial_spot/sample_000.jpg", "Tomato Bacterial Spot")
    ]
    
    for image_path, expected_class in test_images:
        if os.path.exists(image_path):
            try:
                img = Image.open(image_path).resize((224, 224))
                img_array = np.expand_dims(np.array(img)/255.0, axis=0)
                
                predictions = model.predict(img_array)
                class_index = np.argmax(predictions)
                confidence = float(np.max(predictions))
                predicted_class = class_names[class_index]
                
                status = "✅" if predicted_class == expected_class else "❌"
                print(f"{status} {expected_class}: Predicted={predicted_class}, Confidence={confidence:.3f}")
                
            except Exception as e:
                print(f"❌ Error processing {image_path}: {e}")
        else:
            print(f"❌ Image not found: {image_path}")

if __name__ == "__main__":
    # Change to the ml-backend directory
    os.chdir("mini-project/server/ml-backend")
    
    # Test model loading
    model, class_names = test_model_loading()
    
    if model is not None:
        # Test healthy image prediction
        test_healthy_image_prediction(model, class_names)
        
        # Test with different images
        test_model_with_different_images(model, class_names)

