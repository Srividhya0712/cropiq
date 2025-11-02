#!/usr/bin/env python3
"""
Test disease detection API with actual image upload
"""

import requests
import os

def test_disease_detection():
    print("Testing disease detection API...")
    
    # Check if we have a sample image
    sample_image_path = "ml-backend/data/healthy/sample_000.jpg"
    
    if not os.path.exists(sample_image_path):
        print("No sample image found. Creating a simple test...")
        # Test without image first
        try:
            response = requests.post("http://localhost:5000/api/detect-disease")
            print(f"Response status: {response.status_code}")
            print(f"Response text: {response.text}")
        except Exception as e:
            print(f"Error: {e}")
        return
    
    print(f"Using sample image: {sample_image_path}")
    
    try:
        # Test with actual image upload
        with open(sample_image_path, 'rb') as f:
            files = {'leaf': f}
            response = requests.post("http://localhost:5000/api/detect-disease", files=files)
        
        print(f"Response status: {response.status_code}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("Success!")
            print(f"Disease: {result.get('disease', 'Unknown')}")
            print(f"Confidence: {result.get('confidence', 'Unknown')}")
        else:
            print("Error occurred!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_disease_detection()
