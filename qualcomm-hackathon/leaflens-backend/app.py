import os
import subprocess
import json
import re
import numpy as np
from PIL import Image
import io
import tensorflow as tf

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173'], supports_credentials=True)

# TFLite Setup
MODEL_PATH = os.path.join(os.getcwd(), "model", "plant_leaf_diseases_model.tflite")
if not os.path.isfile(MODEL_PATH):
    raise RuntimeError(f"Model file not found at {MODEL_PATH}")

interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details  = interpreter.get_input_details()[0]
output_details = interpreter.get_output_details()[0]

CLASS_NAMES = [
    "Pepper_bell_Bacterial_spot",
    "Pepperbell_healthy",
    "Potato_Early_blight",
    "Potato_Late_blight",
    "Potato_healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "TomatoTarget_Spot",
    "TomatoTomato_YellowLeafCurl_Virus",
    "Tomato_Tomato_mosaic_virus",
    "Tomato_healthy"
]
assert len(CLASS_NAMES) == 15

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((256, 256), Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

# Ollama Setup
OLLAMA_BIN = r"C:\Users\sp284\AppData\Local\Programs\Ollama\ollama.exe"
MODEL_NAME  = "qwen3:4b"

# Map front‑end language codes to human names
LANG_MAP = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "gu": "Gujarati"
}

@app.route("/analyze", methods=["POST"])
@cross_origin()
def analyze():
    try:
        # 1) Validate inputs: we only require the image file and language
        if "file" not in request.files or "lang" not in request.form:
            return jsonify({"error": "file and lang are required"}), 400

        lang_code = request.form["lang"].strip()
        lang_name = LANG_MAP.get(lang_code, "English")

        img_bytes = request.files["file"].read()

        # 2) TFLite inference
        data = preprocess_image(img_bytes)
        interpreter.set_tensor(input_details["index"], data)
        interpreter.invoke()
        raw_output = interpreter.get_tensor(output_details["index"])
        out = np.array(raw_output).flatten()

        if out.shape[0] != len(CLASS_NAMES):
            return jsonify({
                "error": "Model output length mismatch",
                "output_len": int(out.shape[0]),
                "num_classes": len(CLASS_NAMES)
            }), 500

        top_idx  = int(np.argmax(out))
        top3_idx = np.argsort(out)[-3:][::-1]
        top3 = [{"label": CLASS_NAMES[i], "score": float(out[i]*100)} for i in top3_idx]

        predicted  = CLASS_NAMES[top_idx]
        confidence = float(out[top_idx]*100)

        # 3) Infer the plant name from the predicted class
        plant = predicted.split('_')[0]

        # 4) Build Ollama prompt
        full_prompt = (
            f"Plant: {plant}\n"
            f"Disease: {predicted}\n\n"
            "Respond ONLY with a raw JSON object. Do not include explanations or extra text.\n"
            "The JSON must have these keys:\n"
            "  disease_type, symptoms, prevention, treatments, fertilizers, expected_yield\n"
            f"Please respond in {lang_name}."
        )

        # 5) Run Ollama CLI
        try:
            proc = subprocess.run(
                [OLLAMA_BIN, "run", MODEL_NAME, full_prompt],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='ignore',
                timeout=120
            )
        except subprocess.TimeoutExpired:
            return jsonify({"error": "LLM call timed out"}), 504

        if proc.returncode != 0:
            app.logger.error("Ollama stderr: %s", proc.stderr)
            return jsonify({"error": "LLM call failed", "details": proc.stderr.strip()}), 500

        llm_out = proc.stdout.strip()

        # 6) Extract JSON substring
        m = re.search(r"(\{.*\})", llm_out, re.DOTALL)
        if not m:
            app.logger.error("No JSON found in Ollama output: %s", llm_out)
            return jsonify({"error": "Invalid LLM response"}), 500

        llm = json.loads(m.group(1))

        # 7) Build final response
        resp = {
            "predicted":      predicted,
            "confidence":     confidence,
            "top3":           top3,
            "disease_type":   llm.get("disease_type", ""),
            "symptoms":       llm.get("symptoms", ""),
            "prevention":     llm.get("prevention", ""),
            "treatments":     llm.get("treatments", ""),
            "fertilizers":    llm.get("fertilizers", ""),
            "expected_yield": llm.get("expected_yield", "")
        }
        return jsonify(resp)

    except Exception as e:
        app.logger.exception("Error in /analyze")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
