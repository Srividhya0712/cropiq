import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Comprehensive plant database with detailed information
const PLANT_DATABASE = [
  {
    id: 1,
    commonName: "Rice",
    scientificName: "Oryza sativa",
    family: "Poaceae",
    nativeRegion: "Asia",
    growingConditions: "Requires flooded paddy fields or well-irrigated conditions",
    soilType: ["Alluvial", "Clay", "Loamy", "Deltaic Alluvium"],
    soilPh: "5.5 - 7.0",
    temperatureRange: "20°C - 35°C",
    optimalTemperature: "25°C - 30°C",
    sunlight: "Full sun (6-8 hours daily)",
    waterNeeds: "High - Requires constant flooding or frequent irrigation",
    growingSeason: "Monsoon and winter seasons",
    harvestTime: "120-150 days",
    yieldPerHectare: "3000-6000 kg",
    nutrients: ["Nitrogen (high)", "Phosphorus (medium)", "Potassium (medium)"],
    spacing: "20-25 cm between plants, 20-25 cm between rows",
    plantingDepth: "1-2 cm",
    hardinessZone: "9-11",
    diseases: ["Blast", "Brown spot", "Bacterial blight", "Tungro virus"],
    pests: ["Stem borers", "Leaf folders", "Planthoppers"],
    specialNotes: "Staple food crop. Requires paddy field cultivation or well-drained soils with good irrigation."
  },
  {
    id: 2,
    commonName: "Wheat",
    scientificName: "Triticum aestivum",
    family: "Poaceae",
    nativeRegion: "Middle East",
    growingConditions: "Cool season crop, requires well-drained soils",
    soilType: ["Loamy", "Clay Loam", "Sandy Loam", "Black Soil"],
    soilPh: "6.0 - 7.5",
    temperatureRange: "10°C - 25°C",
    optimalTemperature: "15°C - 20°C",
    sunlight: "Full sun (6-8 hours daily)",
    waterNeeds: "Moderate - 450-650 mm during growing season",
    growingSeason: "Winter season (Rabi)",
    harvestTime: "100-130 days",
    yieldPerHectare: "3000-5000 kg",
    nutrients: ["Nitrogen (high)", "Phosphorus (medium)", "Potassium (low)"],
    spacing: "15-20 cm between rows",
    plantingDepth: "3-5 cm",
    hardinessZone: "3-9",
    diseases: ["Rust", "Smut", "Powdery mildew", "Fusarium head blight"],
    pests: ["Aphids", "Army worms", "Thrips"],
    specialNotes: "Major cereal crop. Sensitive to high temperatures during grain filling."
  },
  {
    id: 3,
    commonName: "Tomato",
    scientificName: "Solanum lycopersicum",
    family: "Solanaceae",
    nativeRegion: "South America",
    growingConditions: "Warm season, requires well-drained fertile soil",
    soilType: ["Loamy", "Sandy Loam", "Clay Loam"],
    soilPh: "6.0 - 6.8",
    temperatureRange: "18°C - 30°C",
    optimalTemperature: "21°C - 24°C",
    sunlight: "Full sun (8-10 hours daily)",
    waterNeeds: "Moderate to high - Consistent moisture, avoid waterlogging",
    growingSeason: "Year-round in tropical regions, spring-summer in temperate",
    harvestTime: "70-90 days from transplanting",
    yieldPerHectare: "25,000-40,000 kg",
    nutrients: ["Nitrogen (medium)", "Phosphorus (high)", "Potassium (high)"],
    spacing: "60-90 cm between plants, 120-150 cm between rows",
    plantingDepth: "Deep planting (up to first true leaves)",
    hardinessZone: "9-11",
    diseases: ["Early blight", "Late blight", "Bacterial spot", "Fusarium wilt"],
    pests: ["Aphids", "Whiteflies", "Tomato hornworms", "Spider mites"],
    specialNotes: "Most popular vegetable. Requires staking or trellising. Sensitive to frost."
  },
  {
    id: 4,
    commonName: "Potato",
    scientificName: "Solanum tuberosum",
    family: "Solanaceae",
    nativeRegion: "South America",
    growingConditions: "Cool season crop, requires loose well-drained soil",
    soilType: ["Sandy Loam", "Loamy", "Well-drained Clay"],
    soilPh: "4.8 - 5.5",
    temperatureRange: "15°C - 25°C",
    optimalTemperature: "18°C - 20°C",
    sunlight: "Full sun (6-8 hours daily)",
    waterNeeds: "Moderate - Regular watering, avoid waterlogging",
    growingSeason: "Cool season, can grow in higher altitudes",
    harvestTime: "80-120 days",
    yieldPerHectare: "20,000-35,000 kg",
    nutrients: ["Nitrogen (medium)", "Phosphorus (high)", "Potassium (very high)"],
    spacing: "30-40 cm between plants, 60-75 cm between rows",
    plantingDepth: "10-15 cm",
    hardinessZone: "3-10",
    diseases: ["Late blight", "Early blight", "Common scab", "Bacterial wilt"],
    pests: ["Colorado potato beetle", "Aphids", "Wireworms"],
    specialNotes: "Staple food crop. Requires hilling/earthing up. Store in cool, dark place."
  },
  {
    id: 5,
    commonName: "Maize",
    scientificName: "Zea mays",
    family: "Poaceae",
    nativeRegion: "Central America",
    growingConditions: "Warm season crop, requires fertile well-drained soil",
    soilType: ["Loamy", "Sandy Loam", "Black Soil", "Alluvial"],
    soilPh: "5.8 - 7.0",
    temperatureRange: "15°C - 30°C",
    optimalTemperature: "21°C - 27°C",
    sunlight: "Full sun (8+ hours daily)",
    waterNeeds: "Moderate to high - 500-800 mm during growing season",
    growingSeason: "Summer (Kharif)",
    harvestTime: "80-110 days",
    yieldPerHectare: "4000-7000 kg",
    nutrients: ["Nitrogen (very high)", "Phosphorus (medium)", "Potassium (medium)"],
    spacing: "20-30 cm between plants, 60-75 cm between rows",
    plantingDepth: "3-5 cm",
    hardinessZone: "4-10",
    diseases: ["Corn smut", "Rust", "Leaf blight", "Stalk rot"],
    pests: ["Corn earworm", "Armyworms", "Stem borers", "Aphids"],
    specialNotes: "Major cereal crop. Requires good pollination. High nitrogen feeder."
  },
  {
    id: 6,
    commonName: "Cotton",
    scientificName: "Gossypium hirsutum",
    family: "Malvaceae",
    nativeRegion: "Mexico",
    growingConditions: "Warm season, requires deep well-drained soil",
    soilType: ["Black Soil", "Alluvial", "Clay Loam"],
    soilPh: "5.8 - 8.0",
    temperatureRange: "21°C - 30°C",
    optimalTemperature: "24°C - 28°C",
    sunlight: "Full sun (8-10 hours daily)",
    waterNeeds: "Moderate - 600-700 mm, drought tolerant after establishment",
    growingSeason: "Summer (Kharif)",
    harvestTime: "150-180 days",
    yieldPerHectare: "400-800 kg lint",
    nutrients: ["Nitrogen (high)", "Phosphorus (medium)", "Potassium (medium)"],
    spacing: "60-90 cm between plants, 90-120 cm between rows",
    plantingDepth: "2-3 cm",
    hardinessZone: "9-12",
    diseases: ["Fusarium wilt", "Verticillium wilt", "Bacterial blight"],
    pests: ["Bollworms", "Aphids", "Whiteflies", "Thrips"],
    specialNotes: "Cash crop. Requires warm, sunny climate. Fiber and oil crop."
  },
  {
    id: 7,
    commonName: "Sugarcane",
    scientificName: "Saccharum officinarum",
    family: "Poaceae",
    nativeRegion: "New Guinea",
    growingConditions: "Tropical/subtropical, requires heavy well-drained soil",
    soilType: ["Black Soil", "Alluvial", "Clay Loam", "Red Loam"],
    soilPh: "6.0 - 7.5",
    temperatureRange: "26°C - 32°C",
    optimalTemperature: "27°C - 30°C",
    sunlight: "Full sun (8-10 hours daily)",
    waterNeeds: "High - 1500-2500 mm annually",
    growingSeason: "Year-round in tropical regions",
    harvestTime: "10-18 months",
    yieldPerHectare: "60,000-100,000 kg",
    nutrients: ["Nitrogen (very high)", "Phosphorus (medium)", "Potassium (high)"],
    spacing: "90-120 cm between rows",
    plantingDepth: "5-7 cm",
    hardinessZone: "10-12",
    diseases: ["Red rot", "Smut", "Rust", "Mosaic virus"],
    pests: ["Sugarcane borers", "White grubs", "Aphids"],
    specialNotes: "Perennial crop. Major source of sugar and bioethanol. Ratoon crop can be grown."
  },
  {
    id: 8,
    commonName: "Banana",
    scientificName: "Musa acuminata",
    family: "Musaceae",
    nativeRegion: "Southeast Asia",
    growingConditions: "Tropical, requires fertile well-drained soil",
    soilType: ["Alluvial", "Loamy", "Sandy Loam"],
    soilPh: "5.5 - 7.0",
    temperatureRange: "20°C - 35°C",
    optimalTemperature: "25°C - 30°C",
    sunlight: "Full sun to partial shade (6-8 hours daily)",
    waterNeeds: "High - 1000-2500 mm annually, consistent moisture",
    growingSeason: "Year-round in tropical regions",
    harvestTime: "12-18 months",
    yieldPerHectare: "30,000-50,000 kg",
    nutrients: ["Nitrogen (high)", "Phosphorus (medium)", "Potassium (very high)"],
    spacing: "2-3 meters between plants",
    plantingDepth: "30-45 cm",
    hardinessZone: "10-12",
    diseases: ["Panama disease", "Black Sigatoka", "Bunchy top virus"],
    pests: ["Banana weevils", "Nematodes", "Aphids"],
    specialNotes: "Perennial fruit crop. Requires protection from strong winds. Produces one bunch per plant."
  },
  {
    id: 9,
    commonName: "Mango",
    scientificName: "Mangifera indica",
    family: "Anacardiaceae",
    nativeRegion: "India, Myanmar",
    growingConditions: "Tropical/subtropical, requires deep well-drained soil",
    soilType: ["Alluvial", "Loamy", "Sandy Loam", "Red Laterite"],
    soilPh: "5.5 - 7.5",
    temperatureRange: "24°C - 30°C",
    optimalTemperature: "26°C - 28°C",
    sunlight: "Full sun (8+ hours daily)",
    waterNeeds: "Moderate - 750-1000 mm annually, drought tolerant when mature",
    growingSeason: "Year-round growth, flowers in winter",
    harvestTime: "100-150 days after flowering",
    yieldPerHectare: "8,000-15,000 kg (varies by variety)",
    nutrients: ["Nitrogen (medium)", "Phosphorus (low)", "Potassium (medium)"],
    spacing: "10-12 meters between trees",
    plantingDepth: "Same depth as nursery container",
    hardinessZone: "10-12",
    diseases: ["Anthracnose", "Powdery mildew", "Bacterial canker"],
    pests: ["Mango hoppers", "Fruit flies", "Mealybugs"],
    specialNotes: "National fruit of India. Long-lived trees (100+ years). Requires dry spell for flowering."
  },
  {
    id: 10,
    commonName: "Coconut",
    scientificName: "Cocos nucifera",
    family: "Arecaceae",
    nativeRegion: "Southeast Asia",
    growingConditions: "Tropical coastal regions, requires sandy well-drained soil",
    soilType: ["Sandy", "Coastal Alluvium", "Laterite"],
    soilPh: "5.0 - 8.0",
    temperatureRange: "20°C - 35°C",
    optimalTemperature: "27°C - 32°C",
    sunlight: "Full sun (8+ hours daily)",
    waterNeeds: "High - 1500-2500 mm annually, tolerates saltwater",
    growingSeason: "Year-round in tropical regions",
    harvestTime: "First harvest at 6-8 years, then continuous",
    yieldPerHectare: "10,000-15,000 nuts per year",
    nutrients: ["Nitrogen (medium)", "Phosphorus (low)", "Potassium (very high)"],
    spacing: "7.5-9 meters between trees",
    plantingDepth: "30-40 cm",
    hardinessZone: "11-12",
    diseases: ["Bud rot", "Leaf rot", "Root wilt"],
    pests: ["Rhinoceros beetle", "Red palm weevil", "Mealybugs"],
    specialNotes: "Tree of life. Requires high humidity and coastal climate. Multipurpose crop."
  },
  {
    id: 11,
    commonName: "Groundnut (Peanut)",
    scientificName: "Arachis hypogaea",
    family: "Fabaceae",
    nativeRegion: "South America",
    growingConditions: "Warm season, requires loose sandy soil for pod development",
    soilType: ["Sandy Loam", "Sandy", "Loamy"],
    soilPh: "5.5 - 7.0",
    temperatureRange: "20°C - 30°C",
    optimalTemperature: "25°C - 28°C",
    sunlight: "Full sun (6-8 hours daily)",
    waterNeeds: "Moderate - 500-700 mm, drought tolerant",
    growingSeason: "Summer (Kharif) or winter (Rabi)",
    harvestTime: "90-120 days",
    yieldPerHectare: "2000-3000 kg",
    nutrients: ["Nitrogen (low - fixes own)", "Phosphorus (medium)", "Potassium (low)"],
    spacing: "10-15 cm between plants, 30-45 cm between rows",
    plantingDepth: "3-5 cm",
    hardinessZone: "8-11",
    diseases: ["Early leaf spot", "Late leaf spot", "Rust", "Stem rot"],
    pests: ["Aphids", "Thrips", "Jassids"],
    specialNotes: "Legume crop. Fixes nitrogen. Pods develop underground. Important oilseed crop."
  },
  {
    id: 12,
    commonName: "Chili Pepper",
    scientificName: "Capsicum annuum",
    family: "Solanaceae",
    nativeRegion: "Central America",
    growingConditions: "Warm season, requires well-drained fertile soil",
    soilType: ["Loamy", "Sandy Loam"],
    soilPh: "6.0 - 7.0",
    temperatureRange: "20°C - 30°C",
    optimalTemperature: "24°C - 27°C",
    sunlight: "Full sun (8+ hours daily)",
    waterNeeds: "Moderate - Consistent moisture, avoid waterlogging",
    growingSeason: "Year-round in tropical, summer in temperate",
    harvestTime: "60-90 days from transplanting",
    yieldPerHectare: "15,000-25,000 kg",
    nutrients: ["Nitrogen (medium)", "Phosphorus (medium)", "Potassium (high)"],
    spacing: "45-60 cm between plants, 60-90 cm between rows",
    plantingDepth: "5-7 cm",
    hardinessZone: "9-11",
    diseases: ["Anthracnose", "Bacterial spot", "Powdery mildew"],
    pests: ["Aphids", "Thrips", "Whiteflies", "Fruit borers"],
    specialNotes: "Spice crop. High capsaicin content. Multiple harvests possible."
  },
  {
    id: 13,
    commonName: "Onion",
    scientificName: "Allium cepa",
    family: "Amaryllidaceae",
    nativeRegion: "Central Asia",
    growingConditions: "Cool season crop, requires loose fertile soil",
    soilType: ["Sandy Loam", "Loamy", "Alluvial"],
    soilPh: "6.0 - 7.0",
    temperatureRange: "13°C - 24°C",
    optimalTemperature: "15°C - 20°C",
    sunlight: "Full sun (6-8 hours daily)",
    waterNeeds: "Moderate - Regular watering until maturity, then reduce",
    growingSeason: "Winter (Rabi)",
    harvestTime: "90-120 days",
    yieldPerHectare: "20,000-30,000 kg",
    nutrients: ["Nitrogen (medium)", "Phosphorus (medium)", "Potassium (high)"],
    spacing: "10-15 cm between plants, 30-45 cm between rows",
    plantingDepth: "2-3 cm",
    hardinessZone: "5-10",
    diseases: ["Purple blotch", "Downy mildew", "Basal rot"],
    pests: ["Thrips", "Onion maggots", "Aphids"],
    specialNotes: "Important vegetable and spice crop. Requires curing after harvest for storage."
  },
  {
    id: 14,
    commonName: "Soybean",
    scientificName: "Glycine max",
    family: "Fabaceae",
    nativeRegion: "East Asia",
    growingConditions: "Warm season, requires well-drained fertile soil",
    soilType: ["Loamy", "Clay Loam", "Black Soil"],
    soilPh: "6.0 - 7.0",
    temperatureRange: "20°C - 30°C",
    optimalTemperature: "24°C - 27°C",
    sunlight: "Full sun (8+ hours daily)",
    waterNeeds: "Moderate - 500-700 mm",
    growingSeason: "Summer (Kharif)",
    harvestTime: "90-120 days",
    yieldPerHectare: "2000-3000 kg",
    nutrients: ["Nitrogen (low - fixes own)", "Phosphorus (high)", "Potassium (medium)"],
    spacing: "5-10 cm between plants, 45-60 cm between rows",
    plantingDepth: "3-5 cm",
    hardinessZone: "2-11",
    diseases: ["Rust", "Bacterial blight", "Sclerotinia stem rot"],
    pests: ["Aphids", "Pod borers", "Stink bugs"],
    specialNotes: "Legume crop. Fixes atmospheric nitrogen. Important protein source."
  },
  {
    id: 15,
    commonName: "Sunflower",
    scientificName: "Helianthus annuus",
    family: "Asteraceae",
    nativeRegion: "North America",
    growingConditions: "Warm season, requires well-drained soil",
    soilType: ["Loamy", "Sandy Loam", "Clay Loam"],
    soilPh: "6.0 - 7.5",
    temperatureRange: "18°C - 27°C",
    optimalTemperature: "21°C - 24°C",
    sunlight: "Full sun (8+ hours daily)",
    waterNeeds: "Moderate - 500-700 mm, drought tolerant",
    growingSeason: "Summer (Kharif)",
    harvestTime: "80-120 days",
    yieldPerHectare: "1500-2500 kg",
    nutrients: ["Nitrogen (high)", "Phosphorus (medium)", "Potassium (medium)"],
    spacing: "20-30 cm between plants, 60-75 cm between rows",
    plantingDepth: "2-3 cm",
    hardinessZone: "4-9",
    diseases: ["Rust", "Downy mildew", "Sclerotinia"],
    pests: ["Sunflower moth", "Aphids", "Cutworms"],
    specialNotes: "Oilseed crop. Heliotropic (follows sun). Attractive to pollinators."
  }
];

function PlantDNA() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Plant name mapping to handle variations and alternative names
  const plantNameMapping = {
    'rice': 'Rice',
    'wheat': 'Wheat',
    'tomato': 'Tomato',
    'potato': 'Potato',
    'maize': 'Maize',
    'corn': 'Maize',
    'cotton': 'Cotton',
    'sugarcane': 'Sugarcane',
    'banana': 'Banana',
    'mango': 'Mango',
    'coconut': 'Coconut',
    'groundnut': 'Groundnut (Peanut)',
    'peanut': 'Groundnut (Peanut)',
    'chili': 'Chili Pepper',
    'chilli': 'Chili Pepper',
    'chili pepper': 'Chili Pepper',
    'onion': 'Onion',
    'soybean': 'Soybean',
    'sunflower': 'Sunflower'
  };

  // Check if a plant name is passed via URL parameter
  useEffect(() => {
    const plantParam = searchParams.get('plant');
    if (plantParam) {
      // Normalize the plant name
      const normalizedParam = plantParam.toLowerCase().trim();
      const mappedName = plantNameMapping[normalizedParam] || plantParam;
      
      // Find matching plant in database
      let plant = PLANT_DATABASE.find(
        p => p.commonName.toLowerCase() === normalizedParam ||
             p.scientificName.toLowerCase() === normalizedParam ||
             p.commonName.toLowerCase() === mappedName.toLowerCase()
      );
      
      // If exact match not found, try partial match
      if (!plant) {
        plant = PLANT_DATABASE.find(
          p => p.commonName.toLowerCase().includes(normalizedParam) ||
               normalizedParam.includes(p.commonName.toLowerCase())
        );
      }
      
      // Try with mapped name if still not found
      if (!plant && mappedName !== plantParam) {
        plant = PLANT_DATABASE.find(
          p => p.commonName.toLowerCase() === mappedName.toLowerCase()
        );
      }
      
      if (plant) {
        setSelectedPlant(plant);
        setSearchTerm(""); // Clear search when plant is selected via URL
      }
    }
  }, [searchParams]);

  const filteredPlants = PLANT_DATABASE.filter(plant =>
    plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlantSelect = (plant) => {
    setSelectedPlant(plant);
    // Update URL without triggering navigation
    navigate(`/plant-dna?plant=${encodeURIComponent(plant.commonName)}`, { replace: true });
  };

  const renderDetailCard = (title, content, icon = "📋") => {
    if (Array.isArray(content)) {
      return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {content.map((item, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm sm:text-base"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </h4>
          <p className="text-base sm:text-lg text-gray-600">{content}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-3">
            Plant DNA Information Database
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl">
            Comprehensive genetic profiles and growing conditions for agricultural crops
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Plant List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Browse Plants</h2>
              
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Plant List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredPlants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => handlePlantSelect(plant)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedPlant?.id === plant.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="text-base sm:text-lg font-semibold">{plant.commonName}</div>
                    <div className={`text-sm sm:text-base ${
                      selectedPlant?.id === plant.id ? "text-green-50" : "text-gray-500"
                    }`}>
                      {plant.scientificName}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Plant Details */}
          <div className="lg:col-span-2">
            {selectedPlant ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
                    {selectedPlant.commonName}
                  </h2>
                  <p className="text-2xl sm:text-3xl text-gray-600 italic">
                    {selectedPlant.scientificName}
                  </p>
                  <div className="mt-3 text-base sm:text-lg text-gray-500">
                    Family: {selectedPlant.family} | Native to: {selectedPlant.nativeRegion}
                  </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {renderDetailCard("Growing Conditions", selectedPlant.growingConditions, "🌱")}
                  {renderDetailCard("Optimal Temperature", selectedPlant.optimalTemperature, "🌡️")}
                  {renderDetailCard("Temperature Range", selectedPlant.temperatureRange, "🌡️")}
                  {renderDetailCard("Sunlight Requirements", selectedPlant.sunlight, "☀️")}
                  {renderDetailCard("Water Needs", selectedPlant.waterNeeds, "💧")}
                  {renderDetailCard("Growing Season", selectedPlant.growingSeason, "📅")}
                  {renderDetailCard("Harvest Time", selectedPlant.harvestTime, "⏰")}
                  {renderDetailCard("Expected Yield", selectedPlant.yieldPerHectare, "📊")}
                  {renderDetailCard("Soil pH", selectedPlant.soilPh, "🧪")}
                  {renderDetailCard("Hardiness Zone", selectedPlant.hardinessZone, "🗺️")}
                  {renderDetailCard("Planting Depth", selectedPlant.plantingDepth, "🔽")}
                  {renderDetailCard("Spacing", selectedPlant.spacing, "📏")}
                </div>

                {/* Extended Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {renderDetailCard("Preferred Soil Types", selectedPlant.soilType, "🌍")}
                  {renderDetailCard("Nutrient Requirements", selectedPlant.nutrients, "🧬")}
                  {renderDetailCard("Common Diseases", selectedPlant.diseases, "🦠")}
                  {renderDetailCard("Common Pests", selectedPlant.pests, "🐛")}
                </div>

                {/* Special Notes */}
                {renderDetailCard("Special Notes", selectedPlant.specialNotes, "📝")}

                {/* Back Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 bg-green-600 text-white rounded-lg text-base sm:text-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🧬</div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-3">
                  Select a Plant to View Details
                </h3>
                <p className="text-lg sm:text-xl text-gray-500">
                  Choose a plant from the list to see comprehensive information about its growing conditions, requirements, and characteristics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantDNA;

