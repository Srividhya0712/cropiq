import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import API_URL from "../config/api";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setError(null);
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        // Automatically trigger prediction after preview is set
        setTimeout(() => {
          handleSubmit();
        }, 0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("leaf", image);

      const response = await fetch(`${API_URL}/api/detect-disease`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      // Check for error response (e.g., "Please upload only plant images")
      if (!response.ok || data.error) {
        throw new Error(data.error || "Please upload only plant images");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to detect disease. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getDiseaseColor = (disease) => {
    const colors = {
      "Healthy": "text-green-600",
      "Pepper Bell Bacterial Spot": "text-orange-600",
      "Pepperbell Healthy": "text-green-600",
      "Potato Early Blight": "text-yellow-600",
      "Potato Late Blight": "text-red-600",
      "Potato Healthy": "text-green-600",
      "Tomato Bacterial Spot": "text-purple-600",
      "Tomato Early Blight": "text-yellow-600",
      "Tomato Late Blight": "text-red-600",
      "Tomato Leaf Mold": "text-blue-600",
      "Tomato Septoria Leaf Spot": "text-orange-600",
      "Tomato Spider Mites Two Spotted Spider Mite": "text-pink-600",
      "Tomato Target Spot": "text-brown-600",
      "Tomato Tomato Yellowleafcurl Virus": "text-yellow-700",
      "Tomato Tomato Mosaic Virus": "text-indigo-600",
      "Tomato Healthy": "text-green-600"
    };
    // Check if disease contains "healthy" (case insensitive)
    if (disease && disease.toLowerCase().includes("healthy")) {
      return "text-green-600";
    }
    return colors[disease] || "text-gray-600";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-6 sm:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header with Theme Toggle */}
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">
              Plant Disease Detection
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 transition-colors">
              Upload a leaf image to detect diseases with AI-powered analysis
            </p>
          </div>
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 transition-colors duration-300">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">
              Upload Leaf Image
            </h2>
            
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-green-400 dark:hover:border-green-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-300 transition-colors">
                      {image ? image.name : "Click to upload image"}
                    </p>
                    <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 transition-colors">
                      JPG, PNG, or GIF up to 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Preview:</h3>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!image || loading}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  "Detect Disease"
                )}
              </button>
              
              {image && (
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg transition-colors">
                <p className="text-red-600 dark:text-red-400 transition-colors">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 transition-colors duration-300">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">
              Detection Results
            </h2>
            
            {result ? (
              <div className="space-y-6">
                {/* Disease Result */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-5 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                  <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                    Detection Result
                  </h3>
                  <div className="text-center">
                    <p className={`text-xl sm:text-2xl font-bold ${getDiseaseColor(result.disease)} mb-2 dark:text-opacity-90`}>
                      {result.message || result.disease}
                    </p>
                    <p className={`text-base sm:text-lg font-semibold ${getConfidenceColor(result.confidence)} dark:text-opacity-90`}>
                      {result.confidence?.toFixed(2) || result.confidence}% Confidence
                    </p>
                  </div>
                </div>

                {/* Top 3 Predictions */}
                {result.top3 && result.top3.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors">Top 3 Predictions:</h4>
                    <div className="space-y-2">
                      {result.top3.map((pred, idx) => {
                        // Format label: replace underscores with spaces and title case
                        const displayLabel = pred.label
                          .replace(/_/g, ' ')
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ');
                        return (
                          <div key={idx} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded transition-colors">
                            <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                              {idx + 1}. {displayLabel}
                            </span>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors">
                              {pred.score?.toFixed(2) || pred.score}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">
                    <span>Confidence Level</span>
                    <span>{result.confidence?.toFixed(2) || result.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        result.confidence >= 90 ? 'bg-green-500' :
                        result.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, result.confidence || 0)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Enhanced Disease Information (from Ollama if available) */}
                {(result.symptoms || result.treatments || result.prevention) && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 transition-colors">Detailed Information:</h4>
                    <div className="space-y-3 text-sm">
                      {result.disease_type && (
                        <div>
                          <span className="font-semibold text-blue-700 dark:text-blue-400 transition-colors">Type: </span>
                          <span className="text-blue-600 dark:text-blue-300 transition-colors">{result.disease_type}</span>
                        </div>
                      )}
                      {result.symptoms && (
                        <div>
                          <span className="font-semibold text-blue-700 dark:text-blue-400 transition-colors">Symptoms: </span>
                          <span className="text-blue-600 dark:text-blue-300 transition-colors">{result.symptoms}</span>
                        </div>
                      )}
                      {result.prevention && (
                        <div>
                          <span className="font-semibold text-blue-700 dark:text-blue-400 transition-colors">Prevention: </span>
                          <span className="text-blue-600 dark:text-blue-300 transition-colors">{result.prevention}</span>
                        </div>
                      )}
                      {result.treatments && (
                        <div>
                          <span className="font-semibold text-blue-700 dark:text-blue-400 transition-colors">Treatments: </span>
                          <span className="text-blue-600 dark:text-blue-300 transition-colors">{result.treatments}</span>
                        </div>
                      )}
                      {result.fertilizers && (
                        <div>
                          <span className="font-semibold text-blue-700 dark:text-blue-400 transition-colors">Recommended Fertilizers: </span>
                          <span className="text-blue-600 dark:text-blue-300 transition-colors">{result.fertilizers}</span>
                        </div>
                      )}
                      {result.expected_yield && (
                        <div>
                          <span className="font-semibold text-blue-700 dark:text-blue-400 transition-colors">Expected Yield Impact: </span>
                          <span className="text-blue-600 dark:text-blue-300 transition-colors">{result.expected_yield}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Disease Information */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg transition-colors">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Analysis Summary:</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                    {result.prediction_details?.is_healthy 
                      ? "Your plant appears to be healthy with no visible disease symptoms. Continue with regular care and monitoring."
                      : `Disease detected: ${result.disease}. ${result.symptoms ? '' : 'This is a common plant disease that can affect crop yield and quality. Consider consulting with a plant expert for treatment recommendations.'}`
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleReset}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Analyze Another Image
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 transition-colors">
                  Upload a leaf image to see detection results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 transition-colors duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 transition-colors">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-medium text-gray-800 dark:text-white mb-2 transition-colors">Upload Image</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Take a clear photo of the plant leaf you want to analyze
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3 transition-colors">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-medium text-gray-800 dark:text-white mb-2 transition-colors">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Our trained model analyzes the image using advanced computer vision
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3 transition-colors">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-medium text-gray-800 dark:text-white mb-2 transition-colors">Get Results</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Receive instant diagnosis with confidence scores and recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetection;
