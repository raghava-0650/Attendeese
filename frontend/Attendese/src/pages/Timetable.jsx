// src/pages/Timetable.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { Trash2 } from 'lucide-react';
import Layout from '../components/Layout';

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
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState({ day: '', subject: '' });

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
    setTimetable((prev) => ({
      ...prev,
      [day]: [...prev[day], subjectName],
    }));
  };

  const confirmDeleteSubject = () => {
    const { day, subject } = subjectToDelete;
    const index = timetable[day].indexOf(subject);
    if (index !== -1) {
      const newSubjects = [...timetable[day]];
      newSubjects.splice(index, 1);
      setTimetable((prev) => ({
        ...prev,
        [day]: newSubjects,
      }));
    }
    setShowConfirmModal(false);
  };

  const maxSubjects = Math.max(...daysOfWeek.map(day => timetable[day].length));
  const allEmpty = maxSubjects === 0;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Weekly Timetable</h1>
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all"
          >
            {editMode ? 'Back to Timetable' : 'Add / Edit Subjects'}
          </button>
        </div>

        {!editMode ? (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  {daysOfWeek.map((day) => (
                    <th key={day} className="border border-gray-300 p-3 text-lg">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(allEmpty ? 1 : maxSubjects)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {daysOfWeek.map((day) => (
                      <td key={day} className="border border-gray-300 p-4 h-16 align-top">
                        {timetable[day][rowIndex] || (
                          allEmpty && rowIndex === 0 ? <span className="text-gray-400">No subjects</span> : <span>&nbsp;</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="bg-white rounded-2xl shadow-md p-6 min-h-[350px] flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-purple-700 mb-3">{day}</h2>
                  <select
                    onChange={(e) => handleAddSubjectToDay(day, e.target.value)}
                    className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
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

                  <ul className="space-y-2">
                    {timetable[day].map((subject, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 bg-purple-100 rounded-md shadow-sm flex justify-between items-center group"
                      >
                        <span>{subject}</span>
                        <button
                          onClick={() => {
                            setSubjectToDelete({ day, subject });
                            setShowConfirmModal(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Delete "{subjectToDelete.subject}" from {subjectToDelete.day}?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSubject}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Timetable;