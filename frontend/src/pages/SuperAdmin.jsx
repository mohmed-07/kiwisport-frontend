import React, { useState } from 'react';

export default function SuperAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubName, setClubName] = useState('');

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    // TODO: Connect this to your Django Backend API later
    console.log("Creating new Admin:", { email, password, clubName });
    alert(`Successfully created admin for ${clubName}!`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">👑 Super Admin Panel</h1>
        
        <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
          <p>Use this form to generate new Club Managers.</p>
        </div>

        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Club Name</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. Atlas Gym"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Manager Email</label>
            <input 
              type="email" 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="manager@gym.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Set a temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Create Club Admin
          </button>
        </form>
      </div>
    </div>
  );
}