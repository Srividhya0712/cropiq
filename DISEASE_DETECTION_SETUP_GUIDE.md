# 🌱 Plant Disease Detection System - Complete Setup Guide

## 🎯 Overview
This guide will help you set up a complete plant disease detection system with 90%+ accuracy using AI/ML technology. The system includes:
- **Frontend**: Modern React application with beautiful UI
- **Backend**: Flask API with TensorFlow ML model
- **ML Model**: Transfer learning model using ResNet50V2
- **Features**: Image upload, disease detection, confidence scoring

## 📋 Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Git
- At least 4GB RAM (8GB recommended for training)

## 🚀 Quick Start

### 1. Setup the Backend (ML API)

```bash
# Navigate to the ML backend directory
cd server/ml-backend

# Run the automated setup script
python setup.py

# This will:
# - Install all required dependencies
# - Create necessary directories
# - Set up configuration files
# - Create training and startup scripts
```

### 2. Prepare Training Data

The system needs training images organized in the following structure:
```
data/
├── apple_scab/          # Apple scab disease images
├── apple_rust/          # Apple rust disease images
├── corn_blight/         # Corn blight disease images
├── healthy/             # Healthy plant images
└── tomato_bacterial_spot/ # Tomato bacterial spot images
```

**Recommended Data Sources:**
- [PlantVillage Dataset](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)
- [Plant Disease Recognition](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset)
- [Plant Pathology](https://www.kaggle.com/datasets/codeinstitute/plant-pathology)

**Data Requirements:**
- Minimum 100 images per class (500+ recommended for 90%+ accuracy)
- High-quality images with clear disease symptoms
- Various lighting conditions and angles
- Balanced distribution across classes

### 3. Train the ML Model

```bash
# Navigate to the ML backend directory
cd server/ml-backend

# Run the data preparation script
python collect_data.py --all

# Train the model (this may take 1-4 hours depending on your hardware)
python quick_train.py
```

**Training Process:**
- The model uses transfer learning with ResNet50V2
- Includes data augmentation for better generalization
- Fine-tuning for optimal performance
- Automatic early stopping to prevent overfitting
- Saves the best model based on validation accuracy

### 4. Start the Backend API

```bash
# Start the Flask API server
python start_api.py

# The API will be available at: http://localhost:5000
# Disease detection endpoint: http://localhost:5000/api/detect-disease
```

### 5. Start the Frontend

```bash
# Open a new terminal and navigate to the client directory
cd client

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev

# The frontend will be available at: http://localhost:5173
```

### 6. Use the Disease Detection System

1. **Navigate to the Dashboard**: Go to http://localhost:5173/dashboard
2. **Click "Disease Detection"**: This will take you to the disease detection page
3. **Upload an Image**: Click the upload area and select a leaf image
4. **Get Results**: The system will analyze the image and show:
   - Detected disease type
   - Confidence percentage
   - Treatment recommendations

## 🔧 Advanced Configuration

### Model Configuration
Edit `server/ml-backend/config.py` to customize:
- Model input size
- Batch size
- Learning rate
- Number of epochs
- Data splits

### API Configuration
The Flask API supports:
- CORS for cross-origin requests
- File upload validation
- Error handling
- Response formatting

### Frontend Customization
The React frontend includes:
- Modern UI with Tailwind CSS
- Responsive design
- Image preview
- Loading states
- Error handling

## 📊 Model Performance

### Expected Results
With proper training data (500+ images per class):
- **Accuracy**: 90%+ on validation set
- **Inference Time**: <1 second per image
- **Supported Diseases**: 5 classes
- **Confidence Scoring**: 0-100%

### Model Architecture
- **Base Model**: ResNet50V2 (pre-trained on ImageNet)
- **Transfer Learning**: Fine-tuned for plant diseases
- **Data Augmentation**: Rotation, scaling, flipping
- **Regularization**: Dropout layers to prevent overfitting

## 🐛 Troubleshooting

### Common Issues

1. **"No routes matched location '/disease'"**
   - Solution: The route is `/disease-detection`, not `/disease`
   - Check that the Dashboard navigation is correct

2. **Model training fails**
   - Check that training data is properly organized
   - Ensure sufficient images per class (minimum 50)
   - Verify Python dependencies are installed

3. **API connection errors**
   - Ensure the Flask server is running on port 5000
   - Check CORS configuration
   - Verify the model file exists

4. **Low accuracy**
   - Add more training data
   - Ensure balanced class distribution
   - Check image quality and variety

### Performance Optimization

1. **GPU Training**: Install CUDA for faster training
2. **Data Quality**: Use high-resolution, well-lit images
3. **Model Size**: Adjust batch size based on available memory

## 📈 Monitoring and Maintenance

### Model Evaluation
- Check confusion matrix for class-specific performance
- Monitor validation accuracy during training
- Use test set for final evaluation

### System Monitoring
- Monitor API response times
- Track prediction accuracy in production
- Log errors and user feedback

### Model Updates
- Retrain with new data periodically
- Validate performance on new disease types
- Update model weights as needed

## 🎉 Success Metrics

Your disease detection system is working correctly when:
- ✅ Model achieves 90%+ validation accuracy
- ✅ API responds within 1 second
- ✅ Frontend displays results correctly
- ✅ Users can upload and analyze images successfully

## 📚 Additional Resources

- **TensorFlow Documentation**: https://www.tensorflow.org/
- **Flask Documentation**: https://flask.palletsprojects.com/
- **React Documentation**: https://react.dev/
- **Plant Disease Datasets**: https://www.kaggle.com/datasets?search=plant+disease

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Verify all dependencies are installed correctly
4. Ensure proper file permissions and paths

---

**🎯 Goal**: Achieve 90%+ accuracy in plant disease detection with a user-friendly interface!

**⏱️ Estimated Setup Time**: 2-4 hours (including model training)
**🖥️ Hardware Requirements**: 4GB RAM minimum, GPU recommended for faster training 