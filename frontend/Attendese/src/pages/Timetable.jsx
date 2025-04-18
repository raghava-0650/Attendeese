// src/pages/Timetable.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { Trash2 } from 'lucide-react';

import Layout from '../components/Layout';

const auth = getAuth();
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Timetable() {
  // All subjects you’ve added in Subjects.jsx
  const [allSubjects, setAllSubjects] = useState([]);

  // Current week’s timetable
  const defaultTable = daysOfWeek.reduce((acc, d) => {
    acc[d] = [];
    return acc;
  }, {});
  const [timetable, setTimetable] = useState(defaultTable);

  // Which dropdown value is currently selected for each day
  const [selectedSubject, setSelectedSubject] = useState(
    daysOfWeek.reduce((acc, d) => ({ ...acc, [d]: '' }), {})
  );

  // UI flags
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState({ day: '', subject: '' });

  // Load subjects + timetable once auth is ready
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setAllSubjects([]);
        setTimetable(defaultTable);
        return;
      }
      try {
        const token = await user.getIdToken(true);
        const [subjRes, tableRes] = await Promise.all([
          axios.get('http://localhost:4000/subjects', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:4000/timetable', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAllSubjects(subjRes.data);
        setTimetable(tableRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    });
    return unsubscribe;
  }, []);

  // Add a subject name into a specific day
  const handleAddSubjectToDay = (day, subjectName) => {
    if (!subjectName) return;
    setTimetable(prev => ({
      ...prev,
      [day]: [...prev[day], subjectName],
    }));
    setSelectedSubject(prev => ({ ...prev, [day]: '' }));
  };

  // Save your edited timetable back to the server
  const handleSaveTimetable = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const token = await user.getIdToken(true);
      await axios.post(
        'http://localhost:4000/timetable',
        { days: timetable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Timetable saved!');
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  // Delete confirmation
  const confirmDeleteSubject = () => {
    const { day, subject } = subjectToDelete;
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].filter(s => s !== subject),
    }));
    setShowConfirmModal(false);
  };

  // Helpers for rendering
  const maxSubjects = Math.max(...daysOfWeek.map(d => timetable[d].length));
  const allEmpty = maxSubjects === 0;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header + Save button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Weekly Timetable</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setEditMode(v => !v)}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all"
            >
              {editMode ? 'Back to Timetable' : 'Add / Edit Subjects'}
            </button>
            {editMode && (
              <button
                onClick={handleSaveTimetable}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all"
              >
                Save Timetable
              </button>
            )}
          </div>
        </div>

        {/* View mode: just show the grid */}
        {!editMode ? (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  {daysOfWeek.map(day => (
                    <th key={day} className="border border-gray-300 p-3 text-lg">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(allEmpty ? 1 : maxSubjects)].map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {daysOfWeek.map(day => (
                      <td key={day} className="border border-gray-300 p-4 h-16 align-top">
                        {timetable[day][rowIdx] ?? (
                          allEmpty && rowIdx === 0
                            ? <span className="text-gray-400">No subjects</span>
                            : <span>&nbsp;</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Edit mode: dropdowns to add */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {daysOfWeek.map(day => (
              <div
                key={day}
                className="bg-white rounded-2xl shadow-md p-6 min-h-[350px] flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-purple-700 mb-3">{day}</h2>
                  <select
                    value={selectedSubject[day]}
                    onChange={e => handleAddSubjectToDay(day, e.target.value)}
                    className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="" disabled>Select subject to add</option>
                    {allSubjects.map(subj => (
                      <option key={subj._id} value={subj.name}>
                        {subj.name}
                      </option>
                    ))}
                  </select>
                  <ul className="space-y-2">
                    {timetable[day].map((subj, i) => (
                      <li
                        key={i}
                        className="px-3 py-2 bg-purple-100 rounded-md shadow-sm flex justify-between items-center group"
                      >
                        <span>{subj}</span>
                        <button
                          onClick={() => {
                            setSubjectToDelete({ day, subject: subj });
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

        {/* Delete confirmation */}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Delete “{subjectToDelete.subject}” from {subjectToDelete.day}?
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
}
