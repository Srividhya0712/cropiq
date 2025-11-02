import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><span>🌱</span> CropIQ – Recommendation Result</h2>
      {result ? (
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 sm:p-8 max-w-lg w-full">
          <h3 className="text-xl font-semibold mb-4">Recommended Crops:</h3>
          <pre className="bg-black/30 rounded-lg p-4 text-green-200 overflow-x-auto mb-4">
            {JSON.stringify(result, null, 2)}
          </pre>
          <button onClick={() => navigate(-1)} className="mt-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold rounded-lg hover:scale-105 transition-all">Back</button>
        </div>
      ) : (
        <div className="text-red-400 font-semibold">No result data found. Please try again from the dashboard.</div>
      )}
    </div>
  );
};

export default Result; 