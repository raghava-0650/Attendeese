// src/pages/Profile.jsx
import React from 'react';

const Profile = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="bg-white shadow rounded p-4">
        <p className="mb-2"><strong>Name:</strong> John Doe</p>
        <p className="mb-2"><strong>Email:</strong> john.doe@example.com</p>
        <p className="mb-2"><strong>Attendance:</strong> 85%</p>
        {/* Add more profile information as needed */}
      </div>
    </div>
  );
};

export default Profile;
