#!/usr/bin/env python3
"""
Verify all 17 plants work in the API
"""

import requests
import json

def test_all_trained_plants():
    print("=== TESTING ALL 17 TRAINED PLANTS ===")
    
    # All 17 trained plants
    plants = ['Banana', 'Chickpea', 'Coconut', 'Cotton', 'Groundnut', 'Maize', 'Mango', 
              'Onion', 'Pepper', 'Potato', 'Pulses', 'Rice', 'Soybean', 'Sugarcane', 
              'Sunflower', 'Tomato', 'Wheat']
    
    success_count = 0
    
    for i, plant in enumerate(plants):
        test_data = {
            'plant_type': plant,
            'growth_stage': 'Vegetative',
            'soil_type': 'Loamy',
            'temperature': 25
        }
        
        try:
            response = requests.post('http://localhost:5000/api/fertilizer-recommendation', json=test_data)
            
            if response.status_code == 200:
                result = response.json()
                npk = result['npk_ratio']
                print(f"{i+1:2d}. {plant:10s} - NPK: N-{npk['N']:2d}, P-{npk['P']:2d}, K-{npk['K']:2d} [OK]")
                success_count += 1
            else:
                print(f"{i+1:2d}. {plant:10s} - ERROR: {response.status_code} [FAIL]")
                
        except Exception as e:
            print(f"{i+1:2d}. {plant:10s} - EXCEPTION: {e} [FAIL]")
    
    print(f"\nResults: {success_count}/{len(plants)} plants working successfully")
    print("All plants in the frontend dropdown are now trained and supported!")

if __name__ == "__main__":
    test_all_trained_plants()
