# Disease Detection Model Setup

## Model Information

The disease detection system now uses a high-accuracy **TensorFlow Lite** model that supports **15 different disease classes**:

### Supported Diseases:
- Pepper Bell Bacterial Spot
- Pepperbell Healthy
- Potato Early Blight
- Potato Late Blight
- Potato Healthy
- Tomato Bacterial Spot
- Tomato Early Blight
- Tomato Late Blight
- Tomato Leaf Mold
- Tomato Septoria Leaf Spot
- Tomato Spider Mites (Two-spotted spider mite)
- Tomato Target Spot
- Tomato Yellow Leaf Curl Virus
- Tomato Mosaic Virus
- Tomato Healthy

## Model Location

The TFLite model file is located at:
```
server/model/plant_leaf_diseases_model.tflite
```

## Features

1. **High Accuracy**: This model provides significantly better accuracy compared to the previous model
2. **Top 3 Predictions**: The API returns the top 3 most likely predictions with confidence scores
3. **256x256 Image Processing**: Uses optimal image preprocessing for better results
4. **Optional Ollama Integration**: Enhanced disease information using local LLM (optional)

## Optional: Enable Ollama LLM Integration

To enable enhanced disease information (symptoms, treatments, prevention, etc.):

1. Install Ollama from https://ollama.ai
2. Pull a model (e.g., `ollama pull qwen3:4b` or `ollama pull llama3:4b`)
3. Update `server/app.py`:
   - Find the line: `OLLAMA_BIN = None`
   - Replace with: `OLLAMA_BIN = r"C:\Users\YOUR_USERNAME\AppData\Local\Programs\Ollama\ollama.exe"`
   - Adjust the path based on where Ollama is installed on your system
4. Optionally change `OLLAMA_MODEL` to match the model you pulled

### Ollama Benefits:
- Provides detailed disease symptoms
- Suggests prevention methods
- Recommends treatments
- Suggests appropriate fertilizers
- Estimates yield impact

**Note**: The disease detection works perfectly fine without Ollama. Ollama only enhances the response with additional information.

## API Response Format

```json
{
  "disease": "Tomato Bacterial Spot",
  "predicted": "Tomato_Bacterial_spot",
  "confidence": 95.67,
  "message": "Disease detected: Tomato Bacterial Spot",
  "top3": [
    {"label": "Tomato_Bacterial_spot", "score": 95.67},
    {"label": "Tomato_Early_blight", "score": 3.21},
    {"label": "Tomato_healthy", "score": 1.12}
  ],
  "prediction_details": {
    "detected_condition": "Tomato Bacterial Spot",
    "confidence_percentage": 95.67,
    "is_healthy": false
  },
  // Optional Ollama fields (if enabled):
  "disease_type": "...",
  "symptoms": "...",
  "prevention": "...",
  "treatments": "...",
  "fertilizers": "...",
  "expected_yield": "..."
}
```

## Testing

The model is automatically loaded when the server starts. You should see:
```
TFLite disease detection model loaded successfully from ...
Model supports 15 classes
```

If you see an error, check that `server/model/plant_leaf_diseases_model.tflite` exists.

