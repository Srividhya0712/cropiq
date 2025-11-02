#!/usr/bin/env python3
"""
Test multiple problematic combinations to ensure filtering works correctly
"""

import requests
import json

def test_problematic_combinations():
    print("=== TESTING PROBLEMATIC COMBINATIONS ===\n")
    
    test_cases = [
        {
            "name": "Coimbatore, 25-30°C, Spring, Sandy (Your Case)",
            "data": {
                "soil_type": "Sandy",
                "location": "Coimbatore",
                "temperature": 28,
                "temperature_range": "25-30",
                "season": "Spring"
            }
        },
        {
            "name": "Chennai, 20-25°C, Winter, Clay",
            "data": {
                "soil_type": "Clay",
                "location": "Chennai",
                "temperature": 22,
                "temperature_range": "20-25",
                "season": "Winter"
            }
        },
        {
            "name": "Delhi, 15-20°C, Autumn, Sandy",
            "data": {
                "soil_type": "Sandy",
                "location": "Delhi",
                "temperature": 18,
                "temperature_range": "15-20",
                "season": "Autumn"
            }
        },
        {
            "name": "Mumbai, 30-35°C, Summer, Loamy",
            "data": {
                "soil_type": "Loamy",
                "location": "Mumbai",
                "temperature": 32,
                "temperature_range": "30-35",
                "season": "Summer"
            }
        },
        {
            "name": "Bangalore, 20-25°C, Year-round, Clay",
            "data": {
                "soil_type": "Clay",
                "location": "Bangalore",
                "temperature": 23,
                "temperature_range": "20-25",
                "season": "Year-round"
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
                    print("❌ PROBLEM: No recommendations!")
                else:
                    print("✅ SUCCESS: Recommendations found!")
                    
            else:
                print(f"Error: {response.status_code}")
                
        except Exception as e:
            print(f"Exception: {e}")
        
        print("-" * 60)

if __name__ == "__main__":
    test_problematic_combinations()

