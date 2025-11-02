import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import LoginForm from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PlantRecommender from "./pages/PlantRecommender";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import FarmStatistics from "./pages/FarmStatistics";
import Support from "./pages/Support";
import DiseaseDetection from "./pages/DiseaseDetection";
import FertilizerInsights from "./pages/FertilizerInsights";
import PlantDNA from "./pages/PlantDNA";


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path='/plant-recommender' element={<PlantRecommender />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/farm-statistics' element={<FarmStatistics />} />
          <Route path='/support' element={<Support />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/fertilizer-insights" element={<FertilizerInsights />} />
          <Route path="/plant-dna" element={<PlantDNA />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
