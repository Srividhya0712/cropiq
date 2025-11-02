#!/usr/bin/env python3
"""
Test the fertilizer API endpoint
"""

import requests
import json

def test_fertilizer_api():
    print("Testing fertilizer API endpoint...")
    
    # Test data
    test_data = {
        "plant_type": "Tomato",
        "growth_stage": "Vegetative",
        "soil_type": "Loamy", 
        "temperature": 25
    }
    
    try:
        # Make API request
        response = requests.post(
            "http://localhost:5000/api/fertilizer-recommendation",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("API Test Successful!")
            print(f"Plant: {result['plant_type']}")
            print(f"Stage: {result['growth_stage']}")
            print(f"NPK: N-{result['npk_ratio']['N']}, P-{result['npk_ratio']['P']}, K-{result['npk_ratio']['K']}")
            print(f"Application Rate: {result['application_rate']}")
            print(f"Source: {result['source']}")
        else:
            print(f"API Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Connection Error: {e}")
        print("Make sure the server is running on port 5000")

if __name__ == "__main__":
    test_fertilizer_api()
