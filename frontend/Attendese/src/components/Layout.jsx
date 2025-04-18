// src/components/Layout.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  getAuth,
  signOut,
} from 'firebase/auth';
import { Menu } from 'lucide-react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import logo from '../assets/logo.png';

const auth = getAuth();

const Layout = ({ children }) => {
  const [totalAttendance, setTotalAttendance] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!auth.currentUser) return;
        const idToken = await auth.currentUser.getIdToken(true);
        const response = await axios.get('http://localhost:4000/subjects', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const subjects = response.data;
        let totalAttended = 0;
        let totalHours = 0;

        subjects.forEach((subj) => {
          const attended = parseFloat(subj.attended || 0);
          const absent = parseFloat(subj.absent || 0);
          const hour = parseFloat(subj.hourDuration || 1);
          totalAttended += attended * hour;
          totalHours += (attended + absent) * hour;
        });

        const percentage = totalHours === 0 ? 0 : ((totalAttended / totalHours) * 100).toFixed(2);
        setTotalAttendance(percentage);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    alert('you are logged out');
  };

  const navigateTo = (path) => {
    setShowSidebar(false);
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setShowSidebar(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-48 bg-white shadow-lg z-50 transform transition-transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="flex flex-col pt-20 space-y-4 text-left px-4">
          <button onClick={() => navigateTo('/home')} className={`text-lg font-medium ${isActive('/home') ? 'text-purple-700 font-bold' : 'text-gray-700'} hover:text-purple-700`}>Home</button>
          <button onClick={() => navigateTo('/timetable')} className={`text-lg font-medium ${isActive('/timetable') ? 'text-purple-700 font-bold' : 'text-gray-700'} hover:text-purple-700`}>Timetable</button>
          <button onClick={() => navigateTo('/calendar')} className={`text-lg font-medium ${isActive('/calendar') ? 'text-purple-700 font-bold' : 'text-gray-700'} hover:text-purple-700`}>Calendar</button>
          <button onClick={() => navigateTo('/subjects')} className={`text-lg font-medium ${isActive('/subjects') ? 'text-purple-700 font-bold' : 'text-gray-700'} hover:text-purple-700`}>Subjects</button>
        </nav>
      </aside>

      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md relative z-50">
        <div className="flex items-center space-x-2">
          <Menu size={24} className="text-gray-700 cursor-pointer" onClick={() => setShowSidebar(!showSidebar)} />   
          <Link to='/'>     
            <div className="flex items-center">
              <img src={logo} alt="Attendease Logo" className="w-8 h-8 mr-1" />
              <h1 className="text-xl font-semibold text-purple-700">Attendease</h1>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium shadow-sm">
            {totalAttendance !== null ? `${totalAttendance}%` : 'NULL'}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
