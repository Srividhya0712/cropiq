#!/usr/bin/env python3
"""
Test the specific case that's failing
"""

import requests
import json

def test_specific_case():
    print("=== TESTING SPECIFIC CASE: Coimbatore, 25-30°C, Autumn, Clay ===\n")
    
    # Test the specific case
    test_data = {
        'soil_type': 'Clay',
        'location': 'Coimbatore',
        'temperature': 28,
        'temperature_range': '25-30',
        'season': 'Autumn'
    }
    
    try:
        response = requests.post('http://localhost:5000/api/recommend-plants', json=test_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Recommendations: {result['recommendations']}")
            print(f"Message: {result['message']}")
            print(f"Count: {len(result['recommendations'])}")
            
            if len(result['recommendations']) == 0:
                print("\n❌ PROBLEM: No recommendations found!")
                print("Let me test without filters to see what should be recommended...")
                
                # Test without filters
                test_data_no_filters = {
                    'soil_type': 'Clay',
                    'location': 'Coimbatore', 
                    'temperature': 28
                }
                
                response2 = requests.post('http://localhost:5000/api/recommend-plants', json=test_data_no_filters)
                if response2.status_code == 200:
                    result2 = response2.json()
                    print(f"\nWithout filters: {result2['recommendations']}")
                    print(f"Count without filters: {len(result2['recommendations'])}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_specific_case()

