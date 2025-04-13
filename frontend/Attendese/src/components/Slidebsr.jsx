// src/components/Sidebar.jsx
import React from 'react';

import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-8">My App</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link className="hover:text-gray-300" to="/">Home</Link>
          </li>
          <li>
            <Link className="hover:text-gray-300" to="/about">About</Link>
          </li>
          <li>
            <Link className="hover:text-gray-300" to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
