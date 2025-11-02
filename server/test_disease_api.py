#!/usr/bin/env python3
"""
Test the disease detection API endpoint
"""

import requests
import json

def test_disease_api():
    print("Testing disease detection API endpoint...")
    
    try:
        # Test with a simple request (without actual image for now)
        response = requests.get("http://localhost:5000/")
        
        if response.status_code == 200:
            print("Server is running successfully!")
            print("Disease detection model should be loaded")
        else:
            print(f"Server Error: {response.status_code}")
            
    except Exception as e:
        print(f"Connection Error: {e}")
        print("Make sure the server is running on port 5000")

if __name__ == "__main__":
    test_disease_api()
