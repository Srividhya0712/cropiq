import React from 'react';
import { useNavigate } from 'react-router-dom';

function SettingsPanel() {
  return (
    <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Account Settings</h2>
        <div className="mb-2 text-gray-300">Change Password (coming soon)</div>
        <div className="mb-2 text-gray-300">Notification Preferences (coming soon)</div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">App Preferences</h2>
        <div className="mb-2 text-gray-300">Theme: Light/Dark (coming soon)</div>
        <div className="mb-2 text-gray-300">Language: English (coming soon)</div>
      </div>
    </div>
  );
}

const Settings = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-emerald-900 to-black text-white p-4">
      <SettingsPanel />
      <button onClick={() => navigate('/dashboard')} className="mt-8 px-4 py-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition">Back to Dashboard</button>
    </div>
  );
};

export default Settings;