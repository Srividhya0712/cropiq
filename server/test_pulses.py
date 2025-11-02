#!/usr/bin/env python3
"""
Test Pulses input specifically
"""

import requests
import json

def test_pulses():
    print("=== TESTING PULSES INPUT ===")
    
    test_data = {
        'plant_type': 'Pulses',
        'growth_stage': 'Vegetative', 
        'soil_type': 'Clay',
        'temperature': 26
    }
    
    try:
        response = requests.post('http://localhost:5000/api/fertilizer-recommendation', json=test_data)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("SUCCESS!")
            print(f"Plant: {result['plant_type']}")
            print(f"NPK: N-{result['npk_ratio']['N']}, P-{result['npk_ratio']['P']}, K-{result['npk_ratio']['K']}")
            print(f"Source: {result['source']}")
            print(f"Application Rate: {result['application_rate']}")
        else:
            print("ERROR!")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_pulses()

