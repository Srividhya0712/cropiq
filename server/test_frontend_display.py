#!/usr/bin/env python3
"""
Test the improved frontend display with the new API response format
"""

import requests
import os
import json

def test_frontend_display():
    print("=== TESTING FRONTEND DISPLAY IMPROVEMENTS ===\n")
    
    # Test cases
    test_cases = [
        ("Healthy Plant", "ml-backend/data/healthy/sample_000.jpg"),
        ("Apple Scab", "ml-backend/data/apple_scab/sample_000.jpg"),
        ("Corn Blight", "ml-backend/data/corn_blight/sample_000.jpg")
    ]
    
    for test_name, image_path in test_cases:
        print(f"--- {test_name.upper()} FRONTEND DISPLAY ---")
        
        if os.path.exists(image_path):
            try:
                with open(image_path, 'rb') as f:
                    files = {'leaf': f}
                    response = requests.post("http://localhost:5000/api/detect-disease", files=files)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Simulate what the frontend will display
                    print(f"Frontend will show:")
                    print(f"  Title: 'Detection Result'")
                    print(f"  Main Message: '{result['message']}'")
                    print(f"  Confidence: '{result['confidence']}% Confidence'")
                    print(f"  Analysis Summary: {'Healthy plant message' if result['prediction_details']['is_healthy'] else 'Disease detected message'}")
                    print(f"  Color: {'Green' if result['prediction_details']['is_healthy'] else 'Red/Orange'}")
                    
                else:
                    print(f"Error: {response.status_code}")
                    
            except Exception as e:
                print(f"Exception: {e}")
        else:
            print(f"Image not found: {image_path}")
        
        print("-" * 60)

if __name__ == "__main__":
    test_frontend_display()

