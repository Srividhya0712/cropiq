#!/usr/bin/env python3
"""
Test the improved disease detection API
"""

import requests
import json
from PIL import Image
import numpy as np
import io

def test_disease_api():
    print("=== TESTING IMPROVED DISEASE DETECTION API ===\n")
    
    # Create a simple test image (simulating healthy leaf)
    print("Creating test image...")
    
    # Create a green image (simulating healthy leaf)
    img_array = np.random.rand(224, 224, 3) * 0.3 + 0.4
    img_array[:, :, 1] = np.random.rand(224, 224) * 0.4 + 0.6  # More green
    
    # Convert to PIL Image
    img = Image.fromarray((img_array * 255).astype(np.uint8))
    
    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    # Test the API
    try:
        print("Sending request to ML backend...")
        
        files = {'leaf': ('test_leaf.jpg', img_bytes, 'image/jpeg')}
        
        response = requests.post('http://localhost:5000/api/detect-disease', files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Response:")
            print(json.dumps(result, indent=2))
            
            # Check if the response is properly formatted
            if 'message' in result and 'prediction_details' in result:
                print("\n✅ SUCCESS: API returns improved response format!")
                print(f"   Message: {result['message']}")
                print(f"   Is Healthy: {result['prediction_details']['is_healthy']}")
            else:
                print("\n❌ PROBLEM: API response format is not improved!")
                
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_disease_api()



