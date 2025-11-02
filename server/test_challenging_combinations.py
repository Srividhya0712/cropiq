#!/usr/bin/env python3
"""
Test challenging combinations including Red soil and extreme temperature ranges
"""

import requests
import json

def test_challenging_combinations():
    print("=== TESTING CHALLENGING COMBINATIONS ===\n")
    
    test_cases = [
        {
            "name": "Coimbatore, 30-35°C, Winter, Red soil (Your Case)",
            "data": {
                "soil_type": "Red soil",
                "location": "Coimbatore",
                "temperature": 32,
                "temperature_range": "30-35",
                "season": "Winter"
            }
        },
        {
            "name": "Chennai, 35-40°C, Summer, Red soil",
            "data": {
                "soil_type": "Red soil",
                "location": "Chennai",
                "temperature": 37,
                "temperature_range": "35-40",
                "season": "Summer"
            }
        },
        {
            "name": "Delhi, 15-20°C, Winter, Red soil",
            "data": {
                "soil_type": "Red soil",
                "location": "Delhi",
                "temperature": 18,
                "temperature_range": "15-20",
                "season": "Winter"
            }
        },
        {
            "name": "Mumbai, 25-30°C, Autumn, Red soil",
            "data": {
                "soil_type": "Red soil",
                "location": "Mumbai",
                "temperature": 28,
                "temperature_range": "25-30",
                "season": "Autumn"
            }
        },
        {
            "name": "Bangalore, 20-25°C, Spring, Red soil",
            "data": {
                "soil_type": "Red soil",
                "location": "Bangalore",
                "temperature": 23,
                "temperature_range": "20-25",
                "season": "Spring"
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
                
                if len(result['recommendations']) == 0:
                    print("PROBLEM: No recommendations!")
                else:
                    print("SUCCESS: Recommendations found!")
                    
            else:
                print(f"Error: {response.status_code}")
                
        except Exception as e:
            print(f"Exception: {e}")
        
        print("-" * 60)

if __name__ == "__main__":
    test_challenging_combinations()

