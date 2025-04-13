// src/pages/Home.jsx
import React, { useState } from 'react';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Simplified login simulation
    setIsLoggedIn(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {!isLoggedIn ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome to the Attendance App</h1>
          <button 
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login / Signup
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          {/* Example attendance card */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold">Your Attendance</h3>
            <p className="mt-2">Attendance Percentage: <span className="font-bold">85%</span></p>
            {/* Later, you can update this with dynamic data */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
