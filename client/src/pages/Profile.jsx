import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileDetails({ user }) {
  return (
    <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4">
          {user.initials}
        </div>
        <div className="text-xl font-semibold mb-1">{user.name}</div>
        <div className="text-gray-300 text-sm mb-2">{user.email}</div>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Account Details</h2>
        <div className="mb-1"><span className="font-semibold">Name:</span> {user.name}</div>
        <div className="mb-1"><span className="font-semibold">Initials:</span> {user.initials}</div>
        <div className="mb-1"><span className="font-semibold">Email:</span> {user.email}</div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Contact Information</h2>
        <div className="mb-1"><span className="font-semibold">Phone:</span> <span className="text-gray-400">(not set)</span></div>
        <div className="mb-1"><span className="font-semibold">Address:</span> <span className="text-gray-400">(not set)</span></div>
      </div>
    </div>
  );
}

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', initials: '' });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        const name = parsed.name || parsed.username || parsed.email || 'Unknown';
        const email = parsed.email || 'Unknown';
        const initials = name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
        setUser({ name, email, initials });
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-blue-900 to-black text-white p-4">
      <ProfileDetails user={user} />
      <button onClick={() => navigate('/dashboard')} className="mt-8 px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold hover:bg-emerald-700 transition">Back to Dashboard</button>
    </div>
  );
};

export default Profile;