import React, { useState, useEffect } from "react";

const FertilizerInsights = () => {
  const [soilType, setSoilType] = useState("");
  const [plantType, setPlantType] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const [temperature, setTemperature] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempLoading, setTempLoading] = useState(true);

  // Weather API configuration (same as dashboard)
  const API_KEY = "953cb90f15dd29262ddbf6781e3d6c2c";
  const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Fetch temperature automatically from weather API
  const fetchTemperature = async () => {
    setTempLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const url = `${OPENWEATHER_API_URL}?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${API_KEY}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.main && typeof data.main.temp === 'number') {
              setTemperature(Math.round(data.main.temp).toString());
            } else {
              setTemperature("25"); // Default fallback
            }
          } catch (error) {
            console.error('Error fetching temperature:', error);
            setTemperature("25"); // Default fallback
          }
          setTempLoading(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setTemperature("25"); // Default fallback
          setTempLoading(false);
        }
      );
    } else {
      setTemperature("25"); // Default fallback
      setTempLoading(false);
    }
  };

  // Fetch temperature on component mount
  useEffect(() => {
    fetchTemperature();
  }, []);

  const handleGetRecommendation = async () => {
    if (!soilType || !plantType || !growthStage || !temperature) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/fertilizer-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soil_type: soilType,
          plant_type: plantType,
          growth_stage: growthStage,
          temperature: parseFloat(temperature)
        })
      });

      const data = await response.json();
      setRecommendation(data);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      setRecommendation({
        error: "Failed to get recommendation. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Smart Fertilizer Recommendations
          </h1>
          <p className="text-gray-600 text-lg">
            Get personalized NPK fertilizer recommendations based on your plant type, growth stage, temperature, and soil conditions.
          </p>
      </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Fertilizer Analysis
            </h2>
            
            <div className="space-y-4">
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plant Type:</label>
                <select 
                  value={plantType} 
                  onChange={(e) => setPlantType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select Plant Type --</option>
                  <option value="Banana">Banana</option>
                  <option value="Chickpea">Chickpea</option>
                  <option value="Coconut">Coconut</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="Maize">Maize</option>
                  <option value="Mango">Mango</option>
                  <option value="Onion">Onion</option>
                  <option value="Pepper">Pepper</option>
                  <option value="Potato">Potato</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Rice">Rice</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Sunflower">Sunflower</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Wheat">Wheat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Growth Stage:</label>
                <select 
                  value={growthStage} 
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select Growth Stage --</option>
                  <option value="Seedling">Seedling (0-2 weeks)</option>
                  <option value="Vegetative">Vegetative (2-8 weeks)</option>
                  <option value="Flowering">Flowering (8-12 weeks)</option>
                  <option value="Fruiting">Fruiting (12+ weeks)</option>
                  <option value="Maturity">Maturity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type:</label>
                <select 
                  value={soilType} 
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select Soil Type --</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Clay">Clay</option>
                  <option value="Silty">Silty</option>
                  <option value="Peaty">Peaty</option>
                  <option value="Chalky">Chalky</option>
        </select>
      </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C):</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={temperature} 
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="Auto-detected"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      tempLoading ? 'bg-gray-100 opacity-70' : 'bg-white'
                    }`}
                    disabled={tempLoading}
                  />
                  {tempLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-green-600">Auto-detecting...</span>
                    </div>
                  )}
                  {!tempLoading && temperature && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-green-600">
                      ✓ Auto-detected
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Temperature is automatically detected from your location. You can manually adjust if needed.
                </div>
              </div>

            </div>

            <div className="mt-6">
              <button 
                onClick={handleGetRecommendation} 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Getting Recommendation...</span>
                  </>
                ) : (
                  "Get NPK Recommendation"
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Fertilizer Recommendation
            </h2>
            
            {recommendation ? (
              recommendation.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <h3 className="text-red-600 font-semibold mb-2">❌ Error</h3>
                  <p className="text-red-600">{recommendation.error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* NPK Ratio Display */}
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">📊 Recommended NPK Ratio</h4>
                    <div className="inline-block p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
                      <div className="text-3xl font-bold text-gray-800">
                        <span className="text-blue-600">{recommendation.npk_ratio?.N || "N/A"}</span>
                        <span className="mx-3 text-gray-400">:</span>
                        <span className="text-red-600">{recommendation.npk_ratio?.P || "N/A"}</span>
                        <span className="mx-3 text-gray-400">:</span>
                        <span className="text-yellow-600">{recommendation.npk_ratio?.K || "N/A"}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        N : P : K (Nitrogen : Phosphorus : Potassium)
                      </div>
                    </div>
                  </div>

                  {/* Individual NPK Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-2xl mb-2">🔵</div>
                      <div className="text-lg font-semibold text-blue-800">Nitrogen (N)</div>
                      <div className="text-2xl font-bold text-blue-600">{recommendation.npk_ratio?.N || "N/A"}</div>
                      <div className="text-xs text-gray-600 mt-1">For leaf growth</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-2xl mb-2">🔴</div>
                      <div className="text-lg font-semibold text-red-800">Phosphorus (P)</div>
                      <div className="text-2xl font-bold text-red-600">{recommendation.npk_ratio?.P || "N/A"}</div>
                      <div className="text-xs text-gray-600 mt-1">For root & flower</div>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-2xl mb-2">🟡</div>
                      <div className="text-lg font-semibold text-yellow-800">Potassium (K)</div>
                      <div className="text-2xl font-bold text-yellow-600">{recommendation.npk_ratio?.K || "N/A"}</div>
                      <div className="text-xs text-gray-600 mt-1">For fruit quality</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-green-700 mb-2">📊 Application Rate:</h4>
                      <p className="text-gray-700">{recommendation.application_rate}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-green-700 mb-2">💡 Recommendations:</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {recommendation.recommendations?.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-green-700 mb-2">ℹ️ Additional Notes:</h4>
                      <p className="text-gray-700 text-sm">{recommendation.notes}</p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Fill in the form to get fertilizer recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizerInsights;
