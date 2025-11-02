# Disease Detection API

This Flask application provides an API for detecting plant diseases from leaf images using a pre-trained TensorFlow model.

## Features

- **Disease Detection**: Upload leaf images to detect diseases
- **Supported Diseases**: 
  - Apple Scab
  - Apple Rust
  - Corn Blight
  - Healthy
  - Tomato Bacterial Spot

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Model File**: 
   - Place your trained model file `leaf_disease_model.h5` in the same directory as `app.py`
   - The model should be trained to classify the 5 disease categories listed above

3. **Run the Application**:
   ```bash
   python app.py
   ```

## API Endpoints

### Disease Detection
- **URL**: `/api/detect-disease`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**: 
  - `leaf`: Image file (JPG, PNG, etc.)

**Response**:
```json
{
  "disease": "Apple Scab",
  "confidence": 95.67
}
```

## Testing

Run the test script to verify the endpoint:
```bash
python test_disease_detection.py
```

Note: You'll need to provide a sample image file named `sample_leaf.jpg` for testing.

## Error Handling

The API includes comprehensive error handling for:
- Missing model file
- Invalid image uploads
- Processing errors
- CORS issues

## CORS Configuration

The API is configured to accept requests from any origin with proper CORS headers for cross-origin requests. 