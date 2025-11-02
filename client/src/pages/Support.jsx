import React from 'react';
import { useNavigate } from 'react-router-dom';

function SupportPanel() {
  return (
    <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Support</h1>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Contact Support</h2>
        <div className="mb-2 text-gray-300">For help, contact <a href="mailto:support@cropiq.com" className="underline text-blue-300">support@cropiq.com</a></div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">FAQ</h2>
        <div className="mb-2 text-gray-300">Frequently asked questions will appear here (coming soon)</div>
      </div>
    </div>
  );
}

const Support = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-4">
      <SupportPanel />
      <button onClick={() => navigate('/dashboard')} className="mt-8 px-4 py-2 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-700 transition">Back to Dashboard</button>
    </div>
  );
};

export default Support;