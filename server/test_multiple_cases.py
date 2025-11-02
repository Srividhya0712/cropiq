#!/usr/bin/env python3
"""
Test multiple cases to verify the filtering is working correctly
"""

import requests
import json

def test_multiple_cases():
    print("=== TESTING MULTIPLE FILTERING CASES ===\n")
    
    test_cases = [
        {
            "name": "Coimbatore, 25-30°C, Autumn, Clay (Your Case)",
            "data": {
                "soil_type": "Clay",
                "location": "Coimbatore",
                "temperature": 28,
                "temperature_range": "25-30",
                "season": "Autumn"
            }
        },
        {
            "name": "Chennai, 20-25°C, Spring, Loamy",
            "data": {
                "soil_type": "Loamy",
                "location": "Chennai",
                "temperature": 22,
                "temperature_range": "20-25",
                "season": "Spring"
            }
        },
        {
            "name": "Delhi, 15-20°C, Winter, Sandy",
            "data": {
                "soil_type": "Sandy",
                "location": "Delhi",
                "temperature": 18,
                "temperature_range": "15-20",
                "season": "Winter"
            }
        },
        {
            "name": "Mumbai, 30-35°C, Summer, Clay",
            "data": {
                "soil_type": "Clay",
                "location": "Mumbai",
                "temperature": 32,
                "temperature_range": "30-35",
                "season": "Summer"
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases):
        print(f"--- Test {i+1}: {test_case['name']} ---")
        
        try:
            response = requests.post('http://localhost:5000/api/recommend-plants', json=test_case['data'])
            
            if response.status_code == 200:
                result = response.json()
                print(f"Recommendations: {result['recommendations']}")
                print(f"Count: {len(result['recommendations'])}")
                print(f"Message: {result['message']}")
            else:
                print(f"Error: {response.status_code}")
                
        except Exception as e:
            print(f"Exception: {e}")
        
        print("-" * 60)

if __name__ == "__main__":
    test_multiple_cases()

