#!/usr/bin/env python3
"""
Test the enhanced plant recommendation API with temperature range and season
"""

import requests
import json

def test_enhanced_plant_recommendations():
    print("=== TESTING ENHANCED PLANT RECOMMENDATIONS ===\n")
    
    # Test cases with different combinations
    test_cases = [
        {
            "name": "Basic Test (No Filters)",
            "data": {
                "soil_type": "Loamy",
                "location": "Chennai",
                "temperature": 28
            }
        },
        {
            "name": "Temperature Range Filter",
            "data": {
                "soil_type": "Loamy", 
                "location": "Chennai",
                "temperature": 28,
                "temperature_range": "25-30"
            }
        },
        {
            "name": "Season Filter",
            "data": {
                "soil_type": "Loamy",
                "location": "Chennai", 
                "temperature": 28,
                "season": "Summer"
            }
        },
        {
            "name": "Both Filters",
            "data": {
                "soil_type": "Loamy",
                "location": "Chennai",
                "temperature": 28,
                "temperature_range": "25-30",
                "season": "Summer"
            }
        },
        {
            "name": "Cool Temperature Range",
            "data": {
                "soil_type": "Loamy",
                "location": "Delhi",
                "temperature": 15,
                "temperature_range": "15-20",
                "season": "Winter"
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases):
        print(f"--- Test {i+1}: {test_case['name']} ---")
        
        try:
            response = requests.post('http://localhost:5000/api/recommend-plants', json=test_case['data'])
            
            if response.status_code == 200:
                result = response.json()
                print(f"Status: 200 OK")
                print(f"Recommendations: {result['recommendations']}")
                print(f"Message: {result['message']}")
                print(f"Filters Applied: Temp Range: {result.get('temperature_range', 'None')}, Season: {result.get('season', 'None')}")
            else:
                print(f"Status: {response.status_code}")
                print(f"Error: {response.text}")
                
        except Exception as e:
            print(f"Exception: {e}")
        
        print("-" * 60)

if __name__ == "__main__":
    test_enhanced_plant_recommendations()

