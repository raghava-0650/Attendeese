// src/pages/Timetable.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = () => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [timetable, setTimetable] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });
  const [showDeleteDropdown, setShowDeleteDropdown] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });

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
        setAllSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  const handleAddSubjectToDay = (day, subjectName) => {
    if (!subjectName) return;
    if (timetable[day].includes(subjectName)) return;
    setTimetable((prev) => ({
      ...prev,
      [day]: [...prev[day], subjectName],
    }));
  };

  const handleDeleteSubjectFromDay = (day, subjectName) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: prev[day].filter((s) => s !== subjectName),
    }));
    setShowDeleteDropdown((prev) => ({ ...prev, [day]: false }));
  };

  const toggleDeleteDropdown = (day) => {
    setShowDeleteDropdown((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Weekly Timetable</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-white rounded-2xl shadow-md p-6 min-h-[350px] flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-purple-700 mb-3">{day}</h2>

              {/* Add + Delete Button Row */}
              <div className="flex items-center gap-2 mb-4">
                <select
                  onChange={(e) => handleAddSubjectToDay(day, e.target.value)}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select subject to add
                  </option>
                  {allSubjects.map((subject) => (
                    <option key={subject._id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => toggleDeleteDropdown(day)}
                  className="bg-red-100 text-red-700 px-3 py-2 text-sm rounded-lg hover:bg-red-200 whitespace-nowrap"
                >
                  {showDeleteDropdown[day] ? 'Cancel Delete' : 'Delete Subject'}
                </button>
              </div>

              {/* Dropdown to Delete Subject */}
              {showDeleteDropdown[day] && (
                <select
                  onChange={(e) => handleDeleteSubjectFromDay(day, e.target.value)}
                  className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select subject to remove
                  </option>
                  {timetable[day].map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              )}

              {/* Display Selected Subjects */}
              <ul className="space-y-2">
                {timetable[day].map((subject, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 bg-purple-100 rounded-md shadow-sm text-center"
                  >
                    {subject}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
