#!/usr/bin/env python3
"""
Create a demo model for disease detection testing
This creates a simple model that can be used for demonstration purposes
"""

import tensorflow as tf
import numpy as np
import os

def create_demo_model():
    """Create a simple demo model for disease detection"""
    print("🌱 Creating demo disease detection model...")
    
    # Create a simple CNN model
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        tf.keras.layers.MaxPooling2D(2, 2),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2, 2),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(5, activation='softmax')  # 5 disease classes
    ])
    
    # Compile the model
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Create dummy training data to initialize the model
    print("📊 Initializing model with dummy data...")
    dummy_images = np.random.random((100, 224, 224, 3))
    dummy_labels = np.random.randint(0, 5, (100,))
    dummy_labels = tf.keras.utils.to_categorical(dummy_labels, 5)
    
    # Train for a few epochs to initialize weights
    model.fit(dummy_images, dummy_labels, epochs=1, verbose=0)
    
    # Save the model
    model_path = "leaf_disease_model.h5"
    model.save(model_path)
    
    print(f"✅ Demo model saved as: {model_path}")
    print("📝 Note: This is a demo model. For accurate results, train with real disease images.")
    
    return model_path

if __name__ == "__main__":
    create_demo_model()
