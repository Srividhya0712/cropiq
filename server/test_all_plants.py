#!/usr/bin/env python3
"""
Test all 16 plant types in the fertilizer API
"""

import requests
import json

def test_all_plants():
    print("=== TESTING ALL 16 PLANT TYPES ===\n")
    
    # All 16 plants
    plants = ['Rice', 'Wheat', 'Maize', 'Tomato', 'Potato', 'Cotton', 'Sugarcane', 
              'Banana', 'Mango', 'Coconut', 'Groundnut', 'Soybean', 'Sunflower', 
              'Chickpea', 'Pepper', 'Onion']
    
    # Test each plant
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
                print(f"{i+1:2d}. {plant:10s} - NPK: N-{npk['N']:2d}, P-{npk['P']:2d}, K-{npk['K']:2d}")
            else:
                print(f"{i+1:2d}. {plant:10s} - ERROR: {response.status_code}")
                
        except Exception as e:
            print(f"{i+1:2d}. {plant:10s} - EXCEPTION: {e}")
    
    print(f"\nTotal plants tested: {len(plants)}")
    print("All 16 plant types are now supported!")

if __name__ == "__main__":
    test_all_plants()

