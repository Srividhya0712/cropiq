// API Configuration
// Uses environment variable in production, falls back to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;

