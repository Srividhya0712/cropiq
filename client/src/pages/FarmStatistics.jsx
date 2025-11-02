import React from 'react';
import { useNavigate } from 'react-router-dom';

function FarmStatsPanel() {
  return (
    <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Farm Statistics</h1>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Overview</h2>
        <div className="mb-2 text-gray-300">Total Crops: (coming soon)</div>
        <div className="mb-2 text-gray-300">Total Yield: (coming soon)</div>
        <div className="mb-2 text-gray-300">Total Area: (coming soon)</div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Recent Activity</h2>
        <div className="mb-2 text-gray-300">No recent activity (coming soon)</div>
      </div>
    </div>
  );
}

const FarmStatistics = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-900 via-green-900 to-black text-white p-4">
      <FarmStatsPanel />
      <button onClick={() => navigate('/dashboard')} className="mt-8 px-4 py-2 bg-yellow-600 rounded-lg text-white font-bold hover:bg-yellow-700 transition">Back to Dashboard</button>
    </div>
  );
};

export default FarmStatistics;