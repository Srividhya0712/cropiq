import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import Webcam from "react-webcam";
import API_URL from "../config/api";

// Custom icon components to replace lucide-react
const Camera = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <circle cx={12} cy={13} r={3} />
  </svg>
);

const Upload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const MapPin = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Thermometer = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a6 6 0 0012 0v-3" />
  </svg>
);

const Leaf = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Sparkles = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
  </svg>
);

const ChevronDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SOIL_TYPES = [
  { name: "Sandy", emoji: "🏖️", color: "from-yellow-400 to-amber-500" },
  { name: "Clay", emoji: "🧱", color: "from-orange-400 to-red-500" },
  { name: "Silty", emoji: "🌊", color: "from-blue-400 to-indigo-500" },
  { name: "Peaty", emoji: "🌿", color: "from-green-400 to-emerald-500" },
  { name: "Chalky", emoji: "⚪", color: "from-gray-400 to-slate-500" },
  { name: "Loamy", emoji: "🌱", color: "from-emerald-400 to-green-600" },
  { name: "Red Soil", emoji: "🔴", color: "from-red-400 to-rose-500" },
  { name: "Black Soil", emoji: "⚫", color: "from-gray-600 to-black" },
  { name: "Alluvial Soil", emoji: "🏞️", color: "from-teal-400 to-cyan-500" },
  { name: "Laterite Soil", emoji: "🟠", color: "from-orange-500 to-red-600" },
  { name: "Saline Soil", emoji: "🧂", color: "from-blue-300 to-blue-500" },
  { name: "Alkaline Soil", emoji: "🔵", color: "from-purple-400 to-blue-500" },
  { name: "Coastal Alluvium", emoji: "🏖️", color: "from-cyan-400 to-blue-500" },
  { name: "Deltaic Alluvium", emoji: "🏞️", color: "from-green-400 to-teal-500" },
  { name: "Mixed Red and Black Soil", emoji: "🔴⚫", color: "from-red-400 to-gray-600" },
  { name: "Forest Soil", emoji: "🌲", color: "from-green-500 to-emerald-700" },
  { name: "Calcareous Soil", emoji: "🤍", color: "from-gray-300 to-gray-500" }
];

export default function PlantRecommender() {
  const navigate = useNavigate();
  const [soilType, setSoilType] = useState("");
  const [soilImage, setSoilImage] = useState(null);
  const [location, setLocation] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [temperature, setTemperature] = useState(null);
  const [fetchingTemp, setFetchingTemp] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [climateZone, setClimateZone] = useState("");
  const [analysisDetails, setAnalysisDetails] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [temperatureRange, setTemperatureRange] = useState("");
  const [season, setSeason] = useState("");
  const webcamRef = useRef(null);

  // Handle soil image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, GIF, or WebP).");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("File size too large. Please select an image smaller than 5MB.");
      return;
    }

    // Clear any previous errors
    setError("");
    
    // Set the file and clear other inputs
    setSoilImage(file);
    setSoilType("");
    setCapturedImage(null);
    setRecommendations([]);
    setClimateZone("");
    setAnalysisDetails({});
    
    console.log("Image selected:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB");
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Create a fake event object to reuse handleImageChange
      const fakeEvent = { target: { files: [file] } };
      handleImageChange(fakeEvent);
    }
  };

  // Handle soil type selection
  const handleSoilTypeChange = (selectedSoil) => {
    setSoilType(selectedSoil);
    setSoilImage(null);
    setCapturedImage(null);
    setDropdownOpen(false);
    setRecommendations([]);
    setClimateZone("");
    setAnalysisDetails({});
  };

  // Handle camera capture (real webcam)
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
    setSoilImage(null);
    setSoilType("");
    setRecommendations([]);
    setClimateZone("");
    setAnalysisDetails({});
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  // Add geocoding helper
  const getCoordsFromLocation = async (locationName) => {
    const GEOCODE_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=1&appid=${WEATHER_API_KEY}`;
    try {
      const res = await fetch(GEOCODE_API_URL);
      const data = await res.json();
      console.log('Geocoding API response:', data); // Debug log
      if (Array.isArray(data) && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      }
      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  const WEATHER_API_KEY = "953cb90f15dd29262ddbf6781e3d6c2c";
  const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const fetchTemperature = async (customLocation) => {
    setFetchingTemp(true);
    let lat, lon;
    let usedLocation = customLocation !== undefined ? customLocation : location;
    if (usedLocation && usedLocation.trim() !== "") {
      // Use geocoding API
      const coords = await getCoordsFromLocation(usedLocation);
      if (!coords) {
        setTemperature(null);
        setFetchingTemp(false);
        setError("Location not found. Please enter a valid location name.");
        return;
      }
      lat = coords.lat;
      lon = coords.lon;
    } else if (navigator.geolocation) {
      // Use browser geolocation
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            resolve();
          },
          (err) => {
            setTemperature(null);
            setFetchingTemp(false);
            setError("Location permission denied or unavailable.");
            console.error('Geolocation error:', err);
            resolve();
          }
        );
      });
      if (!lat || !lon) return;
    } else {
      setTemperature(null);
      setFetchingTemp(false);
      setError("Geolocation not supported");
      console.error('Geolocation not supported');
      return;
    }
    try {
      const res = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
      const data = await res.json();
      console.log('Weather API response:', data); // Debug log
      if (data && data.main && typeof data.main.temp === 'number') {
        setTemperature(Math.round(data.main.temp));
        setError("");
      } else {
        setTemperature(null);
        setError("Could not fetch temperature for this location.");
      }
    } catch (err) {
      setTemperature(null);
      setError("Weather fetch error");
      console.error('Weather fetch error:', err);
    }
    setFetchingTemp(false);
  };

  // Fetch temperature on every page load
  React.useEffect(() => {
    fetchTemperature();
    // eslint-disable-next-line
  }, []);

  // Still fetch temperature when soilType, soilImage, or capturedImage changes
  React.useEffect(() => {
    if (soilType || soilImage || capturedImage) {
      fetchTemperature();
    }
    // eslint-disable-next-line
  }, [soilType, soilImage, capturedImage]);

  // Handle form submission
  const handleSubmit = async () => {
    console.log("handleSubmit called"); // Debug log
    setLoading(true);
    setError("");
    
    // Validate that user has provided either soil type or image
    if (!soilType && !soilImage && !capturedImage) {
      setError("Please select a soil type or upload/capture a soil image first.");
      setLoading(false);
      return;
    }
    
    let detectedSoilType = soilType;
    let imageToSend = soilImage;

    // If camera image is used, convert dataURL to Blob
    if (capturedImage) {
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      imageToSend = new File([blob], "captured.jpg", { type: blob.type });
    }

    // If image is uploaded or captured, detect soil type via backend
    if (imageToSend) {
      const formData = new FormData();
      formData.append("image", imageToSend);
      try {
        const res = await fetch(`${API_URL}/api/detect-soil`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        
        // Check for error response (e.g., "Please upload only plant images")
        if (!res.ok || data.error) {
          setError(data.error || "Please upload only plant images");
          setLoading(false);
          return;
        }
        
        if (data.soil_type) {
          detectedSoilType = data.soil_type;
          console.log("Detected soil type:", detectedSoilType);
        } else {
          setError("Could not detect soil type from image.");
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Error detecting soil type.");
        setLoading(false);
        return;
      }
    }

    // Ensure we have a valid soil type
    if (!detectedSoilType) {
      setError("No soil type available. Please select a soil type or upload an image.");
      setLoading(false);
      return;
    }

    // Ensure we have temperature data
    if (temperature === null) {
      setError("Temperature data not available. Please wait for temperature to load or enter a location.");
      setLoading(false);
      return;
    }

    // Get plant recommendations
    try {
      console.log("Sending recommendation request with:", {
        soil_type: detectedSoilType,
        location: location || "Current Location",
        temperature: temperature
      });
      
      const res = await fetch(`${API_URL}/api/recommend-plants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soil_type: detectedSoilType,
          location: location || "Current Location",
          temperature: temperature,
          temperature_range: temperatureRange,
          season: season,
        }),
      });
      const data = await res.json();
      console.log("Recommendation response:", data);
      
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setClimateZone(data.climate_zone || "");
        setAnalysisDetails({
          soil_type: data.soil_type,
          location: data.location,
          temperature: data.temperature,
          message: data.message
        });
        setError("");
      } else {
        setError("No recommendations found for the given conditions.");
        setRecommendations([]);
        setClimateZone("");
        setAnalysisDetails({});
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Error fetching recommendations. Please try again.");
      setRecommendations([]);
    }
    setLoading(false);
  };

  const selectedSoilData = SOIL_TYPES.find(soil => soil.name === soilType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-6 sm:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header with Theme Toggle */}
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">
              Plant Recommender AI
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 transition-colors">
              Discover the perfect plants for your soil using advanced AI analysis and environmental data
            </p>
          </div>
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 transition-colors duration-300">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">
              Soil & Climate Analysis
            </h2>

            <div className="space-y-4">
              {/* Location Input */}
              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city, state, or country"
                    className="w-full pl-10 pr-4 py-4 sm:py-5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-base sm:text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Temperature Display */}
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">Current Temperature</span>
                  </div>
                  <div className="text-right">
                    {fetchingTemp ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-blue-600 dark:text-blue-400 transition-colors">Fetching...</span>
                      </div>
                    ) : temperature !== null ? (
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400 transition-colors">{temperature}°C</span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Not available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Temperature Range Selection */}
              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Preferred Temperature Range
                </label>
                <select 
                  value={temperatureRange} 
                  onChange={(e) => setTemperatureRange(e.target.value)}
                  className="w-full px-4 py-4 sm:py-5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-base sm:text-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="">-- Select Temperature Range --</option>
                  <option value="15-20">15-20°C (Cool)</option>
                  <option value="20-25">20-25°C (Moderate)</option>
                  <option value="25-30">25-30°C (Warm)</option>
                  <option value="30-35">30-35°C (Hot)</option>
                  <option value="35-40">35-40°C (Very Hot)</option>
                </select>
              </div>

              {/* Season Selection */}
              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Planting Season
                </label>
                <select 
                  value={season} 
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-4 py-4 sm:py-5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-base sm:text-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="">-- Select Season --</option>
                  <option value="Spring">Spring (Mar-May)</option>
                  <option value="Summer">Summer (Jun-Aug)</option>
                  <option value="Autumn">Autumn (Sep-Nov)</option>
                  <option value="Winter">Winter (Dec-Feb)</option>
                  <option value="Year-round">Year-round</option>
                </select>
              </div>

              {/* Soil Type Selection */}
              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Soil Type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-4 sm:py-5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-base sm:text-lg text-gray-900 dark:text-white hover:border-green-400 dark:hover:border-green-500 transition-colors"
                  >
                    <span className={soilType ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                      {soilType || "Select soil type"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto transition-colors">
                      {SOIL_TYPES.map((soil) => (
                        <button
                          key={soil.name}
                          onClick={() => handleSoilTypeChange(soil.name)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className={`w-10 h-10 bg-gradient-to-br ${soil.color} rounded-full flex items-center justify-center text-xl shadow-lg`}>
                            {soil.emoji}
                          </div>
                          <div>
                            <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white transition-colors">{soil.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{soil.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600 transition-colors"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">OR</span>
                    </div>
                  </div>

              {/* Camera/Upload Section */}
              <div className="space-y-4">
                {/* Camera Option */}
                {cameraEnabled && !capturedImage && !soilImage && !showCamera && (
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
                  >
                    <Camera className="w-5 h-5" />
                    Use Camera to Capture Leaf Image
                  </button>
                )}

                {/* Camera View */}
                {cameraEnabled && showCamera && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-600 transition-colors">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={280}
                      height={210}
                      videoConstraints={{ facingMode: "environment" }}
                      className="rounded border mb-4 mx-auto w-full max-w-xs"
                    />
                    <button
                      type="button"
                      onClick={handleCapture}
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                    >
                      Capture & Analyze
                    </button>
                  </div>
                )}

                {/* Captured Image */}
                {capturedImage && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 transition-colors">
                    <div className="text-center mb-4">
                      <img 
                        src={capturedImage} 
                        alt="Captured leaf" 
                        className="rounded-lg mx-auto border-2 border-green-400 dark:border-green-500 shadow-lg w-full max-w-xs" 
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {cameraEnabled && (
                        <button
                          type="button"
                          onClick={handleRetake}
                          className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Retake Photo
                        </button>
                      )}
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-6 py-2 rounded-lg font-medium border border-green-200 dark:border-green-800 transition-colors">
                        ✓ Photo Ready for Analysis
                      </div>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                {!capturedImage && !showCamera && (
                  <div className="space-y-4">
                    {/* File Input with Better Styling */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={!!soilType || !!capturedImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="soil-image-upload"
                      />
                      <label
                        htmlFor="soil-image-upload"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`block w-full border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                          soilType || capturedImage
                            ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                            : isDragOver
                            ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/30 scale-105'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <Upload className={`w-10 h-10 transition-colors ${
                              isDragOver ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-colors">
                              {isDragOver 
                                ? 'Drop your leaf image here!' 
                                : soilImage 
                                ? 'Image Selected ✓' 
                                : 'Click to Upload or Drag & Drop Leaf Image'
                              }
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                              Upload a plant leaf image - Supports JPG, PNG, GIF, WebP (Max 5MB)
                            </p>
                          </div>
                          {!soilImage && !isDragOver && (
                            <div className="text-sm text-blue-600 dark:text-blue-400 transition-colors">
                              📸 Camera mode recommended for best results! Please ensure you capture a leaf image.
                            </div>
                          )}
                          {isDragOver && (
                            <div className="text-sm text-green-600 dark:text-green-400 animate-pulse transition-colors">
                              ✨ Release to upload your leaf image
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Selected File Display */}
                    {soilImage && (
                      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                            <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate transition-colors">
                              {soilImage.name}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400 transition-colors">
                              {(soilImage.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSoilImage(null);
                              setRecommendations([]);
                              setClimateZone("");
                              setAnalysisDetails({});
                            }}
                            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                            title="Remove file"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Alternative Upload Methods */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-3">Or use one of these methods:</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSoilType("");
                            setSoilImage(null);
                            setCapturedImage(null);
                            setShowCamera(true);
                          }}
                          className="px-4 py-2 bg-blue-100 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-200 transition-colors text-sm"
                        >
                          📷 Use Camera
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSoilImage(null);
                            setCapturedImage(null);
                            setDropdownOpen(true);
                          }}
                          className="px-4 py-2 bg-purple-100 border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-200 transition-colors text-sm"
                        >
                          🏷️ Select Soil Type
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || (!soilType && !soilImage && !capturedImage)}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing Soil & Climate...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Get Plant Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 transition-colors duration-300 sticky top-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">
              Plant Recommendations
            </h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 transition-colors">
                <p className="text-red-600 dark:text-red-400 text-sm transition-colors">{error}</p>
              </div>
            )}

            {recommendations.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Analysis Details */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 transition-colors">
                  <h4 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2 transition-colors">
                    <MapPin className="w-5 h-5" />
                    Analysis Details
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors">Soil Type:</span>
                        <span className="text-gray-900 dark:text-white font-medium text-sm transition-colors">{analysisDetails.soil_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors">Climate Zone:</span>
                        <span className="text-gray-900 dark:text-white font-medium capitalize text-sm transition-colors">{climateZone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors">Location:</span>
                        <span className="text-gray-900 dark:text-white font-medium text-sm transition-colors">{analysisDetails.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors">Temperature:</span>
                        <span className="text-gray-900 dark:text-white font-medium text-sm transition-colors">{analysisDetails.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
                    <p className="text-green-800 dark:text-green-300 text-sm transition-colors">{analysisDetails.message}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {recommendations.map((plant, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(`/plant-dna?plant=${encodeURIComponent(plant)}`)}
                      className="w-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 hover:bg-green-100 dark:hover:bg-green-900/50 hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer text-left group"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-base sm:text-lg font-medium text-green-800 dark:text-green-300 group-hover:text-green-900 dark:group-hover:text-green-200 transition-colors">
                          {plant}
                        </p>
                        <svg 
                          className="w-5 h-5 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-1 transition-colors">Click to view detailed information</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Ready for Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm px-4 transition-colors">Select your soil type or upload an image to get personalized plant recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}