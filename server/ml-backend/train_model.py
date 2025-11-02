import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50V2
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import numpy as np
import os
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

def create_model(num_classes=5):
    """
    Create a transfer learning model using ResNet50V2 as base
    """
    # Load pre-trained ResNet50V2 model
    base_model = ResNet50V2(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Freeze the base model layers
    base_model.trainable = False
    
    # Create the model
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.5),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model

def create_data_generators(data_dir, batch_size=32):
    """
    Create data generators for training and validation
    """
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )
    
    # Only rescaling for validation
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )
    
    # Training generator
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        subset='training'
    )
    
    # Validation generator
    val_generator = val_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation'
    )
    
    return train_generator, val_generator

def train_model(data_dir, epochs=50, batch_size=32):
    """
    Train the disease detection model
    """
    print("Creating data generators...")
    train_generator, val_generator = create_data_generators(data_dir, batch_size)
    
    print("Creating model...")
    model = create_model(num_classes=len(train_generator.class_indices))
    
    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Callbacks
    callbacks = [
        EarlyStopping(patience=10, restore_best_weights=True),
        ReduceLROnPlateau(factor=0.2, patience=5, min_lr=1e-7),
        ModelCheckpoint('best_model.h5', save_best_only=True, monitor='val_accuracy')
    ]
    
    print("Training model...")
    history = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=val_generator,
        callbacks=callbacks,
        verbose=1
    )
    
    # Fine-tuning: Unfreeze some layers and train with lower learning rate
    print("Fine-tuning model...")
    base_model = model.layers[0]
    base_model.trainable = True
    
    # Freeze all layers except the last 30
    for layer in base_model.layers[:-30]:
        layer.trainable = False
    
    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Continue training
    history_fine = model.fit(
        train_generator,
        epochs=20,
        validation_data=val_generator,
        callbacks=callbacks,
        verbose=1
    )
    
    # Save the final model
    model.save('leaf_disease_model.h5')
    
    return model, history, history_fine, train_generator, val_generator

def evaluate_model(model, val_generator):
    """
    Evaluate the trained model
    """
    print("Evaluating model...")
    
    # Get predictions
    val_generator.reset()
    predictions = model.predict(val_generator)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = val_generator.classes
    
    # Calculate accuracy
    accuracy = np.mean(predicted_classes == true_classes)
    print(f"Model Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Classification report
    class_names = list(val_generator.class_indices.keys())
    print("\nClassification Report:")
    print(classification_report(true_classes, predicted_classes, target_names=class_names))
    
    # Confusion matrix
    cm = confusion_matrix(true_classes, predicted_classes)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png')
    plt.show()
    
    return accuracy

def plot_training_history(history, history_fine):
    """
    Plot training history
    """
    # Combine histories
    combined_history = {
        'accuracy': history.history['accuracy'] + history_fine.history['accuracy'],
        'val_accuracy': history.history['val_accuracy'] + history_fine.history['val_accuracy'],
        'loss': history.history['loss'] + history_fine.history['loss'],
        'val_loss': history.history['val_loss'] + history_fine.history['val_loss']
    }
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
    
    # Plot accuracy
    ax1.plot(combined_history['accuracy'], label='Training Accuracy')
    ax1.plot(combined_history['val_accuracy'], label='Validation Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Accuracy')
    ax1.legend()
    ax1.grid(True)
    
    # Plot loss
    ax2.plot(combined_history['loss'], label='Training Loss')
    ax2.plot(combined_history['val_loss'], label='Validation Loss')
    ax2.set_title('Model Loss')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Loss')
    ax2.legend()
    ax2.grid(True)
    
    plt.tight_layout()
    plt.savefig('training_history.png')
    plt.show()

if __name__ == "__main__":
    # Data directory structure should be:
    # data/
    #   apple_scab/
    #   apple_rust/
    #   corn_blight/
    #   healthy/
    #   tomato_bacterial_spot/
    
    data_dir = "data"  # Change this to your data directory
    
    if not os.path.exists(data_dir):
        print(f"Data directory '{data_dir}' not found!")
        print("Please create the following directory structure:")
        print("data/")
        print("  apple_scab/")
        print("  apple_rust/")
        print("  corn_blight/")
        print("  healthy/")
        print("  tomato_bacterial_spot/")
        exit(1)
    
    print("Starting model training...")
    model, history, history_fine, train_generator, val_generator = train_model(data_dir)
    
    print("Evaluating model...")
    accuracy = evaluate_model(model, val_generator)
    
    print("Plotting training history...")
    plot_training_history(history, history_fine)
    
    print(f"\nTraining completed! Model saved as 'leaf_disease_model.h5'")
    print(f"Final accuracy: {accuracy*100:.2f}%")
    
    if accuracy >= 0.90:
        print("✅ Model achieved 90%+ accuracy!")
    else:
        print("⚠️ Model accuracy is below 90%. Consider:")
        print("  - Adding more training data")
        print("  - Adjusting model architecture")
        print("  - Using different data augmentation techniques") 