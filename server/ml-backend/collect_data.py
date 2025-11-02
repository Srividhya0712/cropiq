import os
import shutil
from PIL import Image
import argparse

def create_directory_structure():
    """
    Create the required directory structure for training data
    """
    base_dir = "data"
    classes = [
        "apple_scab",
        "apple_rust", 
        "corn_blight",
        "healthy",
        "tomato_bacterial_spot"
    ]
    
    # Create base directory
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
        print(f"Created directory: {base_dir}")
    
    # Create class directories
    for class_name in classes:
        class_dir = os.path.join(base_dir, class_name)
        if not os.path.exists(class_dir):
            os.makedirs(class_dir)
            print(f"Created directory: {class_dir}")
    
    return base_dir

def validate_images(data_dir):
    """
    Validate and count images in each class directory
    """
    classes = os.listdir(data_dir)
    total_images = 0
    
    print("\n=== Data Validation Report ===")
    print(f"{'Class':<25} {'Images':<10} {'Status'}")
    print("-" * 45)
    
    for class_name in classes:
        class_dir = os.path.join(data_dir, class_name)
        if os.path.isdir(class_dir):
            images = [f for f in os.listdir(class_dir) 
                     if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
            
            # Validate each image
            valid_images = []
            for img_file in images:
                img_path = os.path.join(class_dir, img_file)
                try:
                    with Image.open(img_path) as img:
                        img.verify()  # Verify image integrity
                    valid_images.append(img_file)
                except Exception as e:
                    print(f"Invalid image {img_file}: {e}")
                    # Remove invalid image
                    os.remove(img_path)
            
            count = len(valid_images)
            total_images += count
            
            # Status indicator
            if count >= 100:
                status = "✅ Good"
            elif count >= 50:
                status = "⚠️ Fair"
            else:
                status = "❌ Poor"
            
            print(f"{class_name:<25} {count:<10} {status}")
    
    print("-" * 45)
    print(f"{'Total':<25} {total_images:<10}")
    
    return total_images

def resize_images(data_dir, target_size=(224, 224)):
    """
    Resize all images to target size for consistent training
    """
    print(f"\nResizing images to {target_size}...")
    
    classes = os.listdir(data_dir)
    processed = 0
    
    for class_name in classes:
        class_dir = os.path.join(data_dir, class_name)
        if os.path.isdir(class_dir):
            images = [f for f in os.listdir(class_dir) 
                     if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
            
            for img_file in images:
                img_path = os.path.join(class_dir, img_file)
                try:
                    with Image.open(img_path) as img:
                        # Convert to RGB if necessary
                        if img.mode != 'RGB':
                            img = img.convert('RGB')
                        
                        # Resize image
                        img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
                        
                        # Save resized image
                        img_resized.save(img_path, quality=95, optimize=True)
                        processed += 1
                        
                except Exception as e:
                    print(f"Error processing {img_file}: {e}")
    
    print(f"Processed {processed} images")

def create_sample_data_info():
    """
    Create information about sample data sources
    """
    info = """
=== Sample Data Sources ===

For training a disease detection model with 90%+ accuracy, you'll need:

1. **Apple Scab** (Venturia inaequalis)
   - Sources: PlantVillage dataset, Kaggle plant disease datasets
   - Recommended: 500+ images
   - Symptoms: Dark brown to black spots on leaves

2. **Apple Rust** (Gymnosporangium juniperi-virginianae)
   - Sources: PlantVillage dataset, agricultural research databases
   - Recommended: 500+ images
   - Symptoms: Orange-yellow spots on leaves

3. **Corn Blight** (Northern Corn Leaf Blight)
   - Sources: PlantVillage dataset, corn disease databases
   - Recommended: 500+ images
   - Symptoms: Gray-green to tan lesions on leaves

4. **Healthy**
   - Sources: PlantVillage dataset, healthy plant image collections
   - Recommended: 500+ images
   - Features: Clean, green leaves without spots or lesions

5. **Tomato Bacterial Spot** (Xanthomonas campestris pv. vesicatoria)
   - Sources: PlantVillage dataset, tomato disease databases
   - Recommended: 500+ images
   - Symptoms: Small, dark, water-soaked spots

=== Recommended Datasets ===

1. PlantVillage Dataset: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
2. Plant Disease Recognition: https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset
3. Plant Pathology: https://www.kaggle.com/datasets/codeinstitute/plant-pathology

=== Data Preparation Tips ===

1. Ensure balanced classes (similar number of images per disease)
2. Use high-quality images with clear disease symptoms
3. Include various lighting conditions and angles
4. Validate image integrity before training
5. Aim for at least 100 images per class for good results

=== Quick Start ===

1. Download images from recommended datasets
2. Organize them into the created directory structure
3. Run this script to validate and resize images
4. Use train_model.py to train your model
"""
    
    with open("data_preparation_guide.txt", "w") as f:
        f.write(info)
    
    print("Created data_preparation_guide.txt with detailed information")

def main():
    parser = argparse.ArgumentParser(description="Prepare training data for disease detection model")
    parser.add_argument("--create-dirs", action="store_true", help="Create directory structure")
    parser.add_argument("--validate", action="store_true", help="Validate existing images")
    parser.add_argument("--resize", action="store_true", help="Resize images to 224x224")
    parser.add_argument("--info", action="store_true", help="Create data preparation guide")
    parser.add_argument("--all", action="store_true", help="Run all preparation steps")
    
    args = parser.parse_args()
    
    if args.all or args.create_dirs:
        print("Creating directory structure...")
        data_dir = create_directory_structure()
    
    if args.all or args.validate:
        data_dir = "data"
        if os.path.exists(data_dir):
            validate_images(data_dir)
        else:
            print("Data directory not found. Run with --create-dirs first.")
    
    if args.all or args.resize:
        data_dir = "data"
        if os.path.exists(data_dir):
            resize_images(data_dir)
        else:
            print("Data directory not found. Run with --create-dirs first.")
    
    if args.all or args.info:
        create_sample_data_info()
    
    if not any([args.create_dirs, args.validate, args.resize, args.info, args.all]):
        print("No action specified. Use --help for options.")
        print("Recommended: python collect_data.py --all")

if __name__ == "__main__":
    main() 