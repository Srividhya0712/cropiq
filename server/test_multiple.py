#!/usr/bin/env python3
"""
Test multiple plant inputs
"""

import requests
import json

def test_multiple_plants():
    print("=== TESTING MULTIPLE PLANT INPUTS ===")
    
    test_cases = [
        {'plant_type': 'Pulses', 'growth_stage': 'Vegetative', 'soil_type': 'Clay', 'temperature': 26},
        {'plant_type': 'Mustard', 'growth_stage': 'Fruiting', 'soil_type': 'Clay', 'temperature': 26},
        {'plant_type': 'Groundnut', 'growth_stage': 'Seedling', 'soil_type': 'Clay', 'temperature': 26}
    ]
    
    for i, test_data in enumerate(test_cases):
        try:
            response = requests.post('http://localhost:5000/api/fertilizer-recommendation', json=test_data)
            
            if response.status_code == 200:
                result = response.json()
                plant = test_data['plant_type']
                npk = result['npk_ratio']
                print(f"{i+1}. {plant:10s} - NPK: N-{npk['N']:2d}, P-{npk['P']:2d}, K-{npk['K']:2d}")
            else:
                print(f"{i+1}. ERROR: {response.status_code}")
                
        except Exception as e:
            print(f"{i+1}. EXCEPTION: {e}")

if __name__ == "__main__":
    test_multiple_plants()

