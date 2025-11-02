#!/usr/bin/env python3
"""
System Test Script for Disease Detection
This script tests all components of the disease detection system.
"""

import os
import sys
import requests
import json
import time
from PIL import Image
import numpy as np

def test_backend_connection():
    """Test if the Flask backend is running"""
    print("🔍 Testing backend connection...")
    try:
        response = requests.get("http://localhost:5000/", timeout=5)
        print("✅ Backend is running")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend connection failed: {e}")
        print("   Make sure to start the backend with: python start_api.py")
        return False

def test_model_file():
    """Test if the trained model file exists"""
    print("🔍 Testing model file...")
    model_path = "leaf_disease_model.h5"
    if os.path.exists(model_path):
        file_size = os.path.getsize(model_path) / (1024 * 1024)  # MB
        print(f"✅ Model file found: {model_path} ({file_size:.1f} MB)")
        return True
    else:
        print(f"❌ Model file not found: {model_path}")
        print("   Train the model first with: python quick_train.py")
        return False

def test_disease_detection_endpoint():
    """Test the disease detection API endpoint"""
    print("🔍 Testing disease detection endpoint...")
    
    # Create a test image (simple colored rectangle)
    test_image = Image.new('RGB', (224, 224), color='green')
    test_image_path = "test_image.jpg"
    test_image.save(test_image_path)
    
    try:
        with open(test_image_path, 'rb') as f:
            files = {'leaf': f}
            response = requests.post(
                "http://localhost:5000/api/detect-disease",
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Disease detection endpoint working")
            print(f"   Response: {result}")
            return True
        else:
            print(f"❌ API returned status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ API request failed: {e}")
        return False
    finally:
        # Clean up test image
        if os.path.exists(test_image_path):
            os.remove(test_image_path)

def test_data_directory():
    """Test if training data directory structure exists"""
    print("🔍 Testing data directory structure...")
    
    required_dirs = [
        "data",
        "data/apple_scab",
        "data/apple_rust",
        "data/corn_blight", 
        "data/healthy",
        "data/tomato_bacterial_spot"
    ]
    
    missing_dirs = []
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            missing_dirs.append(dir_path)
    
    if not missing_dirs:
        print("✅ Data directory structure exists")
        
        # Check if directories have images
        total_images = 0
        for dir_path in required_dirs[1:]:  # Skip the main data directory
            if os.path.exists(dir_path):
                images = [f for f in os.listdir(dir_path) 
                         if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
                total_images += len(images)
                print(f"   {os.path.basename(dir_path)}: {len(images)} images")
        
        if total_images > 0:
            print(f"✅ Total training images: {total_images}")
            return True
        else:
            print("⚠️  No training images found")
            print("   Add images to the data subdirectories")
            return False
    else:
        print("❌ Missing directories:")
        for dir_path in missing_dirs:
            print(f"   - {dir_path}")
        print("   Run: python collect_data.py --create-dirs")
        return False

def test_dependencies():
    """Test if all required Python packages are installed"""
    print("🔍 Testing Python dependencies...")
    
    required_packages = [
        'tensorflow',
        'flask',
        'flask_cors',
        'numpy',
        'PIL',
        'sklearn',
        'matplotlib',
        'seaborn'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            if package == 'PIL':
                import PIL
            elif package == 'sklearn':
                import sklearn
            else:
                __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if not missing_packages:
        print("✅ All required packages are installed")
        return True
    else:
        print("❌ Missing packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("   Install with: pip install -r requirements.txt")
        return False

def test_frontend_connection():
    """Test if the React frontend is accessible"""
    print("🔍 Testing frontend connection...")
    try:
        response = requests.get("http://localhost:5173/", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running")
            return True
        else:
            print(f"⚠️  Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Frontend not accessible: {e}")
        print("   Start frontend with: npm run dev (in client directory)")
        return False

def run_comprehensive_test():
    """Run all tests and provide a summary"""
    print("🚀 Starting Comprehensive System Test")
    print("=" * 50)
    
    tests = [
        ("Dependencies", test_dependencies),
        ("Data Directory", test_data_directory),
        ("Model File", test_model_file),
        ("Backend Connection", test_backend_connection),
        ("Disease Detection API", test_disease_detection_endpoint),
        ("Frontend Connection", test_frontend_connection)
    ]
    
    results = {}
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 30)
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your disease detection system is ready!")
        print("\nNext steps:")
        print("1. Navigate to http://localhost:5173/dashboard")
        print("2. Click 'Disease Detection'")
        print("3. Upload a leaf image to test the system")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please fix the issues above.")
        
        if not results.get("Dependencies", False):
            print("\n💡 To fix dependency issues:")
            print("   cd server/ml-backend && pip install -r requirements.txt")
            
        if not results.get("Data Directory", False):
            print("\n💡 To fix data directory issues:")
            print("   cd server/ml-backend && python collect_data.py --create-dirs")
            
        if not results.get("Model File", False):
            print("\n💡 To fix model file issues:")
            print("   cd server/ml-backend && python quick_train.py")
            
        if not results.get("Backend Connection", False):
            print("\n💡 To fix backend issues:")
            print("   cd server/ml-backend && python start_api.py")
            
        if not results.get("Frontend Connection", False):
            print("\n💡 To fix frontend issues:")
            print("   cd client && npm run dev")

if __name__ == "__main__":
    run_comprehensive_test() 