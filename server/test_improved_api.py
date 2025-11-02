#!/usr/bin/env python3
"""
Test the improved disease detection API responses
"""

import requests
import os
import json

def test_disease_responses():
    print("=== TESTING IMPROVED DISEASE DETECTION API ===\n")
    
    # Test cases
    test_cases = [
        ("Healthy Plant", "ml-backend/data/healthy/sample_000.jpg"),
        ("Apple Scab", "ml-backend/data/apple_scab/sample_000.jpg"),
        ("Corn Blight", "ml-backend/data/corn_blight/sample_000.jpg"),
        ("Tomato Bacterial Spot", "ml-backend/data/tomato_bacterial_spot/sample_000.jpg")
    ]
    
    for test_name, image_path in test_cases:
        print(f"--- {test_name.upper()} TEST ---")
        
        if os.path.exists(image_path):
            try:
                with open(image_path, 'rb') as f:
                    files = {'leaf': f}
                    response = requests.post("http://localhost:5000/api/detect-disease", files=files)
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"Status: {response.status_code}")
                    print(f"Disease: {result['disease']}")
                    print(f"Message: {result['message']}")
                    print(f"Confidence: {result['confidence']}%")
                    print(f"Details: {json.dumps(result['prediction_details'], indent=2)}")
                else:
                    print(f"Error: {response.status_code}")
                    print(f"Response: {response.text}")
                    
            except Exception as e:
                print(f"Exception: {e}")
        else:
            print(f"Image not found: {image_path}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_disease_responses()
