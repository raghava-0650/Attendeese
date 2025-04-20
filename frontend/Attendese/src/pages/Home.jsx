// src/pages/Home.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  format,
  parseISO,
} from 'date-fns';
import { getAuth } from 'firebase/auth';
import {
  Check,
  Minus,
  RotateCcw,
  X,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import Layout from '../components/Layout';

const auth = getAuth();

const Home = () => {
  const [todaySubjects, setTodaySubjects] = useState([]);
  const [subjectStats, setSubjectStats] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});

  const location = useLocation();
  const queryDateString = new URLSearchParams(location.search).get('date');
  const selectedDate = queryDateString ? parseISO(queryDateString) : new Date();
  const formattedDisplayDate = format(selectedDate, 'EEEE, dd MMM yyyy');

  useEffect(() => {
    const fetchSubjects = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const token = await user.getIdToken(true);
        // Send date as YYYY-MM-DD string
        const dateParam = format(selectedDate, 'yyyy-MM-dd');
        const { data } = await axios.get(
          'http://localhost:4000/timetable',
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { date: dateParam }
          }
        );
        console.log('🔍 raw timetable data:', data);

        // Use selectedDate to derive weekday name, not new Date(null)
        const dayName = format(selectedDate, 'EEEE');
        const subjectsForToday = data[dayName] || [];
        const stats = { count: subjectsForToday.length };

        setTodaySubjects(subjectsForToday);
        setSubjectStats(stats);

      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };

    fetchSubjects();
  }, [queryDateString, selectedDate]);

  const handleStatusClick = (subject, status) => {
    setSelectedStatus(prev => ({
      ...prev,
      [subject]: status === 'clear' ? null : status
    }));
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-700">Subjects</h1>
          <p className="text-gray-600 text-sm font-semibold">{formattedDisplayDate}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {todaySubjects.map((subject, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-5 relative border border-gray-200"
            >
              <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-base font-bold shadow-md">
                {subjectStats[subject]?.percentage || '0'}%
              </div>

              <div className="text-lg font-semibold text-gray-800 text-center mb-8">
                {subject}
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleStatusClick(subject, 'present')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    selectedStatus[subject] === 'present'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => handleStatusClick(subject, 'absent')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    selectedStatus[subject] === 'absent'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => handleStatusClick(subject, 'cancelled')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    selectedStatus[subject] === 'cancelled'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                  }`}
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => handleStatusClick(subject, 'clear')}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
