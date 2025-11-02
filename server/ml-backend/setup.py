#!/usr/bin/env python3
"""
Setup script for Plant Disease Detection System
This script will help you set up the complete disease detection pipeline.
"""

import os
import sys
import subprocess
import platform

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f" {title}")
    print("="*60)

def print_step(step, description):
    """Print a formatted step"""
    print(f"\n{step}. {description}")
    print("-" * 40)

def check_python_version():
    """Check if Python version is compatible"""
    print_step("1", "Checking Python version")
    
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def install_dependencies():
    """Install required Python packages"""
    print_step("2", "Installing Python dependencies")
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    print_step("3", "Creating directory structure")
    
    directories = [
        "data",
        "data/apple_scab",
        "data/apple_rust", 
        "data/corn_blight",
        "data/healthy",
        "data/tomato_bacterial_spot",
        "models",
        "logs"
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✅ Created: {directory}")
        else:
            print(f"ℹ️  Exists: {directory}")
    
    return True

def check_gpu():
    """Check for GPU availability"""
    print_step("4", "Checking GPU availability")
    
    try:
        import tensorflow as tf
        gpus = tf.config.list_physical_devices('GPU')
        if gpus:
            print(f"✅ GPU detected: {len(gpus)} device(s)")
            for gpu in gpus:
                print(f"   - {gpu.name}")
            return True
        else:
            print("⚠️  No GPU detected. Training will use CPU (slower)")
            return False
    except ImportError:
        print("⚠️  TensorFlow not installed yet")
        return False

def create_config_file():
    """Create configuration file"""
    print_step("5", "Creating configuration file")
    
    config_content = """# Disease Detection Configuration

# Model Settings
MODEL_INPUT_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.001

# Data Settings
TRAIN_SPLIT = 0.8
VALIDATION_SPLIT = 0.2
TEST_SPLIT = 0.0

# Classes
CLASSES = [
    "apple_scab",
    "apple_rust", 
    "corn_blight",
    "healthy",
    "tomato_bacterial_spot"
]

# API Settings
API_HOST = "localhost"
API_PORT = 5000
DEBUG = True

# File Paths
MODEL_PATH = "models/leaf_disease_model.h5"
DATA_PATH = "data"
LOG_PATH = "logs"
"""
    
    with open("config.py", "w") as f:
        f.write(config_content)
    
    print("✅ Configuration file created: config.py")
    return True

def create_training_script():
    """Create a simple training script"""
    print_step("6", "Creating training script")
    
    script_content = """#!/usr/bin/env python3
\"\"\"
Quick training script for disease detection model
\"\"\"

import os
import sys
from train_model import train_model, evaluate_model

def main():
    print("🌱 Starting Disease Detection Model Training")
    print("=" * 50)
    
    # Check if data exists
    data_dir = "data"
    if not os.path.exists(data_dir):
        print("❌ Data directory not found!")
        print("Please run: python collect_data.py --create-dirs")
        print("Then add your training images to the data/ subdirectories")
        return
    
    # Check data balance
    classes = os.listdir(data_dir)
    print("\\n📊 Data Distribution:")
    for class_name in classes:
        class_dir = os.path.join(data_dir, class_name)
        if os.path.isdir(class_dir):
            images = [f for f in os.listdir(class_dir) 
                     if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
            print(f"   {class_name}: {len(images)} images")
    
    # Start training
    print("\\n🚀 Starting model training...")
    try:
        model, history, history_fine, train_generator, val_generator = train_model(data_dir)
        
        print("\\n📈 Evaluating model...")
        accuracy = evaluate_model(model, val_generator)
        
        if accuracy >= 0.90:
            print("\\n🎉 Congratulations! Model achieved 90%+ accuracy!")
        else:
            print(f"\\n⚠️  Model accuracy: {accuracy*100:.2f}%")
            print("Consider adding more training data or adjusting parameters")
        
        print("\\n✅ Training completed! Model saved as 'leaf_disease_model.h5'")
        
    except Exception as e:
        print(f"\\n❌ Training failed: {e}")
        print("Please check your data and try again")

if __name__ == "__main__":
    main()
"""
    
    with open("quick_train.py", "w") as f:
        f.write(script_content)
    
    # Make executable on Unix systems
    if platform.system() != "Windows":
        os.chmod("quick_train.py", 0o755)
    
    print("✅ Training script created: quick_train.py")
    return True

def create_startup_script():
    """Create startup script for the API"""
    print_step("7", "Creating startup script")
    
    script_content = """#!/usr/bin/env python3
\"\"\"
Startup script for Disease Detection API
\"\"\"

import os
import sys
from app import app

def main():
    print("🌿 Starting Disease Detection API")
    print("=" * 40)
    
    # Check if model exists
    model_path = "leaf_disease_model.h5"
    if not os.path.exists(model_path):
        print("❌ Model file not found!")
        print("Please train the model first:")
        print("   python quick_train.py")
        return
    
    print("✅ Model found")
    print("🚀 Starting Flask server...")
    print("📡 API will be available at: http://localhost:5000")
    print("🔍 Disease detection endpoint: http://localhost:5000/api/detect-disease")
    print("\\nPress Ctrl+C to stop the server")
    
    try:
        app.run(host="localhost", port=5000, debug=True)
    except KeyboardInterrupt:
        print("\\n👋 Server stopped")

if __name__ == "__main__":
    main()
"""
    
    with open("start_api.py", "w") as f:
        f.write(script_content)
    
    # Make executable on Unix systems
    if platform.system() != "Windows":
        os.chmod("start_api.py", 0o755)
    
    print("✅ Startup script created: start_api.py")
    return True

def print_next_steps():
    """Print next steps for the user"""
    print_header("Next Steps")
    
    steps = [
        "📁 Add your training images to the data/ subdirectories",
        "   - data/apple_scab/ (Apple scab disease images)",
        "   - data/apple_rust/ (Apple rust disease images)", 
        "   - data/corn_blight/ (Corn blight disease images)",
        "   - data/healthy/ (Healthy plant images)",
        "   - data/tomato_bacterial_spot/ (Tomato bacterial spot images)",
        "",
        "🌱 Train the model:",
        "   python quick_train.py",
        "",
        "🚀 Start the API:",
        "   python start_api.py",
        "",
        "🔍 Test the API:",
        "   python test_disease_detection.py",
        "",
        "📱 Use the frontend:",
        "   Navigate to the disease detection page in your React app",
        "",
        "📚 For more information:",
        "   - Read data_preparation_guide.txt",
        "   - Check the README.md file",
        "   - Review the training logs in logs/ directory"
    ]
    
    for step in steps:
        print(step)

def main():
    """Main setup function"""
    print_header("Plant Disease Detection System Setup")
    
    print("This script will set up your disease detection system.")
    print("Make sure you have Python 3.8+ installed.")
    
    # Run setup steps
    steps = [
        check_python_version,
        install_dependencies,
        create_directories,
        check_gpu,
        create_config_file,
        create_training_script,
        create_startup_script
    ]
    
    for step in steps:
        if not step():
            print("\n❌ Setup failed at step. Please fix the issue and try again.")
            return False
    
    print_next_steps()
    
    print_header("Setup Complete!")
    print("✅ Your disease detection system is ready to use!")
    print("🎯 Follow the next steps above to get started.")
    
    return True

if __name__ == "__main__":
    main() 