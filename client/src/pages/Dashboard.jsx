import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const API_KEY = "953cb90f15dd29262ddbf6781e3d6c2c";
const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function ProfileMenuItem({ icon, label, onClick, className = "" }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-base sm:text-lg ${className}`}
      onClick={onClick}
    >
      <span className="text-lg sm:text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ProfileSettingsItem(props) {
  return <ProfileMenuItem icon={<span>⚙️</span>} label="Settings" {...props} />;
}
function ProfileSupportItem(props) {
  return <ProfileMenuItem icon={<span>💬</span>} label="Support" {...props} />;
}
function ProfileViewItem(props) {
  return <ProfileMenuItem icon={<span>👤</span>} label="View Profile" {...props} />;
}
function ProfileLogoutItem({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 text-base sm:text-lg"
    >
      <span className="text-lg sm:text-xl">🚪</span>
      <span>Logout</span>
    </button>
  );
}

function ProfileDropdown({ user, showProfile, setShowProfile, handleLogout, handleViewProfile, handleSettings, handleSupport }) {
  return (
    <div className="relative">
      <button 
        onClick={() => setShowProfile(!showProfile)}
        className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm sm:text-base lg:text-lg font-bold">{user.initials}</span>
        </div>
        <span className="text-gray-800 dark:text-gray-200 font-medium text-base sm:text-lg hidden sm:inline transition-colors">{user.name}</span>
        <svg className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showProfile && (
        <div className="absolute right-0 mt-2 w-64 sm:w-72 lg:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 transition-colors duration-300">
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg lg:text-xl">{user.initials}</span>
              </div>
              <div>
                <h3 className="text-gray-800 dark:text-white font-bold text-base sm:text-lg lg:text-xl transition-colors">{user.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base transition-colors">{user.email || 'Premium Farmer'}</p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <ProfileViewItem onClick={handleViewProfile} />
              <ProfileSettingsItem onClick={handleSettings} />
              <ProfileSupportItem onClick={handleSupport} />
              <hr className="border-gray-200 dark:border-gray-700 my-2 transition-colors" />
              <ProfileLogoutItem onClick={handleLogout} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherCard({ weather, weatherLoading, weatherError, getLocationAndFetchWeather }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 transition-colors">
          <span className="text-xl sm:text-2xl">🌤️</span>
          <span>Current Weather Conditions</span>
        </h3>
        {!weatherLoading && !weatherError && (
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>
      {weatherLoading ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8 transition-colors">Loading weather...</div>
      ) : weatherError ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl mb-2">🌧️</div>
          <div className="text-red-600 dark:text-red-400 font-semibold mb-2 transition-colors">{weatherError}</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 transition-colors">Check your internet connection, allow location access, or try again.</div>
          <button
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-bold hover:scale-105 transition-all duration-200"
            onClick={getLocationAndFetchWeather}
            disabled={weatherLoading}
          >
            Retry
          </button>
        </div>
      ) : (
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6">
          <div className="text-center p-4 sm:p-5 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-colors hover:shadow-md">
            <div className="text-3xl sm:text-4xl mb-2">🌡️</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-blue-200 transition-colors mb-1">{weather.temp !== null ? `${weather.temp}°C` : '--'}</div>
            <div className="text-gray-600 dark:text-blue-300 font-medium text-xs sm:text-sm transition-colors">Temperature</div>
          </div>
          <div className="text-center p-4 sm:p-5 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 transition-colors hover:shadow-md">
            <div className="text-3xl sm:text-4xl mb-2">💧</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-cyan-200 transition-colors mb-1">{weather.humidity !== null ? `${weather.humidity}%` : '--'}</div>
            <div className="text-gray-600 dark:text-cyan-300 font-medium text-xs sm:text-sm transition-colors">Humidity</div>
          </div>
          <div className="text-center p-4 sm:p-5 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 transition-colors hover:shadow-md">
            <div className="text-3xl sm:text-4xl mb-2">💨</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-green-200 transition-colors mb-1">{weather.wind !== null ? `${weather.wind} km/h` : '--'}</div>
            <div className="text-gray-600 dark:text-green-300 font-medium text-xs sm:text-sm transition-colors">Wind Speed</div>
          </div>
          <div className="text-center p-4 sm:p-5 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 transition-colors hover:shadow-md">
            <div className="text-3xl sm:text-4xl mb-2">☀️</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-yellow-200 transition-colors mb-1">{weather.condition || '--'}</div>
            <div className="text-gray-600 dark:text-yellow-300 font-medium text-xs sm:text-sm transition-colors">Conditions</div>
          </div>
        </div>
        {/* Weather Forecast */}
        {weather.forecast && weather.forecast.length > 0 && (
          <div className="pt-5 sm:pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 transition-colors">
                <span className="text-xl sm:text-2xl">📅</span>
                <span>7-Day Forecast</span>
              </h4>
            </div>
          <div className="grid grid-cols-7 gap-3 sm:gap-4">
            {weather.forecast.map((day, index) => {
              const date = new Date(day.dt * 1000);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              let icon = '☀️';
              if (day.main === 'Rain') icon = '🌧️';
              else if (day.main === 'Clouds') icon = '⛅';
              else if (day.main === 'Clear') icon = '☀️';
              else if (day.main === 'Snow') icon = '❄️';
              else if (day.main === 'Thunderstorm') icon = '⛈️';
              else if (day.main === 'Drizzle') icon = '🌦️';
              else if (day.main === 'Mist' || day.main === 'Fog') icon = '🌫️';
              else if (day.main === 'Sunny') icon = '☀️';
              else if (day.main === 'Partly Cloudy') icon = '🌤️';
              return (
                <div key={index} className="text-center p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-semibold mb-2 transition-colors">{dayName}</div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">{icon}</div>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 dark:text-gray-200 transition-colors">{day.temp}°C</div>
                </div>
              );
            })}
          </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

function ServicesGrid({ services, handleSelect, hoveredCard, setHoveredCard }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {services.map((service, index) => (
        <div
          key={service.id}
          onClick={() => handleSelect(service.path)}
          onMouseEnter={() => setHoveredCard(service.id)}
          onMouseLeave={() => setHoveredCard(null)}
          className="group relative cursor-pointer"
        >
          {/* Main Card */}
          <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6 transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-xl h-full flex flex-col">
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex items-start gap-3 flex-1">
                 <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300 flex-shrink-0`}>
                   {service.icon}
                 </div>
                 <div className="flex-1 min-w-0">
                   <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                     {service.title}
                   </h3>
                   <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base transition-colors">{service.subtitle}</p>
                 </div>
              </div>
              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 dark:text-green-400 text-sm sm:text-base font-semibold transition-colors hidden sm:inline">ACTIVE</span>
              </div>
            </div>
            
             {/* Description */}
             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 flex-grow transition-colors line-clamp-3">
               {service.description}
             </p>
             
             {/* Stats - Horizontal Layout */}
             <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
               {Object.entries(service.stats).map(([key, value]) => (
                 <div key={key} className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 transition-colors">
                   <div className={`text-base sm:text-lg font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                     {value}
                   </div>
                   <div className="text-gray-600 dark:text-gray-400 text-xs capitalize transition-colors truncate">{key}</div>
                 </div>
               ))}
             </div>
             
             {/* Launch Button */}
             <button className={`w-full py-2.5 sm:py-3 bg-gradient-to-r ${service.gradient} text-white font-semibold text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden`}>
              <span className="relative z-10">Launch Service</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-green-500/30 to-transparent bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </div>
      ))}
    </div>
  );
}


const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({
    name: 'Loading...',
    email: '',
    initials: 'U'
  });
  const [weather, setWeather] = useState({
    temp: null,
    humidity: null,
    wind: null,
    condition: '',
    icon: '',
    forecast: []
  });
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const navigate = useNavigate();

  // Refactored fetchWeather so it can be called on Retry
  const fetchWeather = (lat, lon) => {
    setWeatherLoading(true);
    setWeatherError(null);
    const url = `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`;
    console.log('Weather API URL:', url);
    console.log('Weather API Key:', API_KEY);
    fetch(url)
      .then(async res => {
        let data;
        try {
          data = await res.json();
        } catch (jsonErr) {
          setWeatherError('Failed to parse weather data.');
          setWeatherLoading(false);
          console.error('JSON parse error:', jsonErr);
          return;
        }
        console.log('Weather API response:', data);
        if (!res.ok) {
          let errorMsg = data && data.message ? data.message : 'Unknown error';
          if (res.status === 401) errorMsg = 'Invalid API key. Check your .env file.';
          if (res.status === 403) errorMsg = 'Access forbidden. Your API key may be restricted.';
          if (res.status === 404) errorMsg = 'Weather data not found for your location.';
          setWeatherError(`Weather API error (${res.status}): ${errorMsg}`);
          setWeatherLoading(false);
          return;
        }
        // New check for /weather endpoint fields
        if (!data || !data.main || !data.weather || !data.wind) {
          setWeatherError('Weather data is incomplete or malformed.');
          setWeatherLoading(false);
          return;
        }
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed),
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          forecast: [] // No forecast in /weather endpoint
        });
        setWeatherLoading(false);
      })
      .catch(err => {
        let errorMsg = 'Could not fetch weather data.';
        if (err.message && err.message.includes('Failed to fetch')) {
          errorMsg = 'Network error or CORS issue. Check your internet connection and API endpoint.';
        }
        setWeatherError(errorMsg);
        setWeatherLoading(false);
        console.error('Weather fetch error:', err);
      });
  };

  // Helper to get location and fetch weather
  const getLocationAndFetchWeather = () => {
    setWeatherLoading(true);
    setWeatherError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          setWeatherError('Location permission denied. Please allow location access and try again.');
          setWeatherLoading(false);
        }
      );
    } else {
      setWeatherError('Geolocation not supported by your browser.');
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    // Get user data from localStorage (using 'user' key as per your login logic)
    const getUserData = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          // Prefer name, fallback to username, then email, then 'Farmer'
          const name = (parsedUser.name || parsedUser.username || parsedUser.email || 'Farmer').toString().trim();
          const email = (parsedUser.email || '').toString().trim();
          // Initials: from name, or username/email if no name
          const initials = getInitials(name);
          setUser({
            name,
            email,
            initials
          });
          console.log('[Dashboard] Loaded user:', { name, email, initials });
        } else {
          setUser({
            name: 'Farmer',
            email: 'farmer@example.com',
            initials: 'F'
          });
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        setUser({
          name: 'Farmer',
          email: 'farmer@example.com',
          initials: 'F'
        });
      }
    };

    getUserData();
    getLocationAndFetchWeather();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    // Clear user info from localStorage on logout
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleSelect = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  const handleViewProfile = () => navigate('/profile');
  const handleSettings = () => navigate('/settings');
  const handleSupport = () => navigate('/support');

  const services = [
    {
      id: 'recommender',
      title: 'Plant Recommender',
      subtitle: 'AI-Powered Crop Selection',
      description: 'Get personalized plant recommendations based on your soil type, climate conditions, and farming goals using advanced machine learning algorithms.',
      icon: '🌱',
      gradient: 'from-emerald-400 via-green-500 to-teal-600',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      path: '/plant-recommender',
      stats: { users: '12.4K', accuracy: '96%', plants: '2,847' }
    },
    {
      id: 'disease',
      title: 'Disease Detection',
      subtitle: 'Computer Vision Analysis',
      description: 'Upload images of your crops and get instant disease identification with treatment recommendations powered by state-of-the-art AI technology.',
      icon: '🔬',
      gradient: 'from-rose-400 via-pink-500 to-red-600',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      path: '/disease-detection',
      stats: { scans: '8.9K', speed: '0.3s', diseases: '450+' }
    },
    {
      id: 'fertilizer',
      title: 'Fertilizer Insights',
      subtitle: 'Precision Agriculture',
      description: 'Receive data-driven fertilizer recommendations optimized for your specific crops, soil conditions, and growth stage requirements.',
      icon: '🧪',
      gradient: 'from-blue-400 via-indigo-500 to-purple-600',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      path: '/fertilizer-insights',
      stats: { yield: '+35%', farms: '3.2K', saved: '$2.1M' }
    },
    {
      id: 'plant-dna',
      title: 'Plant DNA Info',
      subtitle: 'Genetic Intelligence',
      description: 'Explore comprehensive genetic profiles, growth patterns, and environmental requirements for thousands of plant species.',
      icon: '🧬',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      path: '/plant-dna',
      stats: { genes: '15K+', species: '5.7K', research: '99.8%' }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl lg:text-4xl">🌾</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white transition-colors">
                  CropIQ
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base transition-colors">Next-Gen Farming Platform</p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              <ThemeToggle />
              <div className="text-right hidden sm:block">
                <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base lg:text-lg transition-colors">Farmer Dashboard</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm transition-colors">{new Date().toLocaleDateString()}</p>
              </div>
              
              {/* Profile Dropdown */}
              <ProfileDropdown 
                user={user} 
                showProfile={showProfile} 
                setShowProfile={setShowProfile} 
                handleLogout={handleLogout}
                handleViewProfile={handleViewProfile}
                handleSettings={handleSettings}
                handleSupport={handleSupport}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10">
        {/* Hero Section - Full Width */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Farm Command
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed transition-colors">
                Unleash the power of AI to revolutionize your farming operations with cutting-edge technology
              </p>
            </div>
            {/* Quick Stats */}
            <div className="flex gap-4 lg:gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {services.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors">Active Tools</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  AI
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors">Powered</div>
              </div>
            </div>
          </div>

          {/* Weather Conditions - Full Width */}
          <WeatherCard 
            weather={weather} 
            weatherLoading={weatherLoading} 
            weatherError={weatherError} 
            getLocationAndFetchWeather={getLocationAndFetchWeather} 
          />
        </div>

        {/* Services Grid - Full Width with 4 columns on large screens */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white transition-colors">
              Available Services
            </h3>
            <div className="hidden sm:flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
              <span>Click any service to get started</span>
            </div>
          </div>
          <ServicesGrid 
            services={services} 
            handleSelect={handleSelect} 
            hoveredCard={hoveredCard} 
            setHoveredCard={setHoveredCard} 
          />
        </div>

        {/* Additional Information Section - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Stats Card */}
           <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 sm:p-6 border border-green-200 dark:border-green-800 transition-colors">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl">
                 📈
               </div>
               <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white transition-colors">Platform Stats</h4>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between items-center">
                 <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Total Users</span>
                 <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white transition-colors">50K+</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Detections Today</span>
                 <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white transition-colors">1,234</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Success Rate</span>
                 <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 transition-colors">98.5%</span>
               </div>
             </div>
           </div>

          {/* Quick Actions Card */}
           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 sm:p-6 border border-blue-200 dark:border-blue-800 transition-colors">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl">
                 ⚡
               </div>
               <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white transition-colors">Quick Actions</h4>
             </div>
             <div className="space-y-2">
               <button 
                 onClick={() => navigate('/plant-recommender')}
                 className="w-full text-left px-3 py-2.5 sm:py-3 bg-white dark:bg-gray-800 rounded-lg text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
               >
                 🌱 Get Plant Recommendations
               </button>
               <button 
                 onClick={() => navigate('/disease-detection')}
                 className="w-full text-left px-3 py-2.5 sm:py-3 bg-white dark:bg-gray-800 rounded-lg text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
               >
                 🔬 Scan for Diseases
               </button>
               <button 
                 onClick={() => navigate('/fertilizer-insights')}
                 className="w-full text-left px-3 py-2.5 sm:py-3 bg-white dark:bg-gray-800 rounded-lg text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
               >
                 🧪 Check Fertilizer Needs
               </button>
             </div>
           </div>

          {/* Tips & Insights Card */}
           <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 sm:p-6 border border-purple-200 dark:border-purple-800 transition-colors">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl">
                 💡
               </div>
               <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white transition-colors">Farming Tips</h4>
             </div>
             <div className="space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors">
               <p className="flex items-start gap-2">
                 <span className="text-purple-500 dark:text-purple-400 text-base">•</span>
                 <span>Monitor weather conditions regularly for optimal planting times</span>
               </p>
               <p className="flex items-start gap-2">
                 <span className="text-purple-500 dark:text-purple-400 text-base">•</span>
                 <span>Early disease detection can save up to 40% of your crop yield</span>
               </p>
               <p className="flex items-start gap-2">
                 <span className="text-purple-500 dark:text-purple-400 text-base">•</span>
                 <span>Use AI recommendations for precision fertilizer application</span>
               </p>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;