import requests
import json

def test_disease_detection():
    """Test the disease detection endpoint"""
    url = "http://localhost:5000/api/detect-disease"
    
    # Test with a sample image (you'll need to provide an actual image file)
    try:
        with open("sample_leaf.jpg", "rb") as f:
            files = {"leaf": f}
            response = requests.post(url, files=files)
            
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except FileNotFoundError:
        print("Sample image file not found. Please provide a sample_leaf.jpg file for testing.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_disease_detection() 