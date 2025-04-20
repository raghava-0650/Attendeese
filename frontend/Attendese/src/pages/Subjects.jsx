import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { getAuth } from 'firebase/auth';

import Layout from '../components/Layout';

const auth = getAuth();
// Create an Axios instance pointing to your backend
const api = axios.create({ baseURL: 'http://localhost:4000' });

// Attach a fresh token on every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    // will auto-refresh if expired
    const token = await user.getIdToken(false);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401-expired, refresh and retry once
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const user = auth.currentUser;
      if (user) {
        try {
          const fresh = await user.getIdToken(true);
          orig.headers.Authorization = `Bearer ${fresh}`;
          return api(orig);
        } catch (e) {
          console.error('Token refresh failed:', e);
        }
      }
    }
    return Promise.reject(err);
  }
);

const Subjects = () => {
  const [subjectName, setSubjectName] = useState('');
  const [attended, setAttended] = useState('');
  const [absent, setAbsent] = useState('');
  const [hourDuration, setHourDuration] = useState('');
  const [note, setNote] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingAttended, setEditingAttended] = useState('');
  const [editingAbsent, setEditingAbsent] = useState('');
  const [editingNote, setEditingNote] = useState('');
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');

  // Fetch on load
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return setSubjects([]);
      try {
        const { data } = await api.get('/subjects');
        setSubjects(data);
      } catch (e) {
        console.error('Fetch subjects failed:', e);
      }
    });
    return unsub;
  }, []);

  // Calculate attendance percentage for a subject
  const calculateAttendancePercentage = (attended, absent, hourDuration) => {
    const totalClasses = attended + absent;
    if (totalClasses === 0) return 0;
    const totalAttendedHours = attended * hourDuration;
    const totalClassesHours = totalClasses * hourDuration;
    return ((totalAttendedHours / totalClassesHours) * 100).toFixed(2);
  };

  // Calculate total attendance for all subjects
  const calculateTotalValues = () => {
    let totalAttendedHours = 0;
    let totalClassesHours = 0;
    subjects.forEach((subj) => {
      const attended = parseFloat(subj.attended || 0);
      const absent = parseFloat(subj.absent || 0);
      const hour = parseFloat(subj.hourDuration || 1);
      totalAttendedHours += attended * hour;
      totalClassesHours += (attended + absent) * hour;
    });
  
    const totalPercentage = totalClassesHours === 0 
      ? 0 
      : ((totalAttendedHours / totalClassesHours) * 100).toFixed(2);
  
    return { totalAttendedHours, totalClassesHours, totalPercentage };
  };
  

  // Determine color based on attendance percentage
  const getColor = (percentage) => {
    const perc = parseFloat(percentage);
    if (perc < 75) return "red";
    else if (perc < 90) return "yellow";
    else return "green";
  };

  const handleAddSubject = async () => {
    if (!subjectName.trim()) return;
    const payload = {
      name: subjectName.trim(),
      attended: parseInt(attended) || 0,
      absent: parseInt(absent) || 0,
      hourDuration: parseFloat(hourDuration) || 1,
      note: note.trim(),
    };
    try {
      const { data: newSubj } = await api.post('/subjects', payload);
      setSubjects((prev) => [...prev, newSubj]);
    } catch (e) {
      console.error('Add subject error:', e);
    }
    // clear inputs
    setSubjectName(''); setAttended(''); setAbsent(''); setHourDuration(''); setNote(''); setIsAdding(false);
  };

  const handleSaveEdit = async () => {
    const orig = subjects[editingIndex];
    const updates = {
      attended: parseInt(editingAttended) || 0,
      absent: parseInt(editingAbsent) || 0,
      note: editingNote.trim(),
    };
    try {
      const { data: updated } = await api.put(`/subjects/${orig._id}`, updates);
      setSubjects((list) => list.map((s, i) => i === editingIndex ? updated : s));
      setEditingIndex(null);
    } catch (e) {
      console.error('Update subject failed:', e);
    }
  };

  const handleDeleteSubject = async () => {
    const orig = subjects[subjectToDelete];
    try {
      await api.delete(`/subjects/${orig._id}`);
      setSubjects((prev) => prev.filter((_, i) => i !== subjectToDelete));
    } catch (e) {
      console.error('Delete subject failed:', e);
    }
    setIsDeleteConfirmationVisible(false);
  };
// Delete confirmation actions
const showDeleteConfirmation = (index) => {
  setIsDeleteConfirmationVisible(true);
  setSubjectToDelete(index);
};
const hideDeleteConfirmation = () => {
  setIsDeleteConfirmationVisible(false);
  setSubjectToDelete(null);
};

// Filter and sort subjects based on search query and sort option
const filteredSubjects = subjects.filter(subj =>
  (subj.name || '').toLowerCase().includes(searchQuery.toLowerCase())
);

const sortedSubjects = filteredSubjects.sort((a, b) => {
  if (sortOption === "nameAsc") return a.name.localeCompare(b.name);
  if (sortOption === "nameDesc") return b.name.localeCompare(a.name);
  const percA = calculateAttendancePercentage(a.attended, a.absent, a.hourDuration);
  const percB = calculateAttendancePercentage(b.attended, b.absent, b.hourDuration);
  if (sortOption === "attendanceAsc") return parseFloat(percA) - parseFloat(percB);
  if (sortOption === "attendanceDesc") return parseFloat(percB) - parseFloat(percA);
  return 0;
});

const { totalAttendedHours, totalClassesHours, totalPercentage } = calculateTotalValues();

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Total Attendance: {totalPercentage}%</p>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              {isAdding ? "Cancel" : "Add Subject"}
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Add Subject</h2>
            <input
              type="text"
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              autoFocus
              className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Optional Note (e.g., exam schedule, teacher info)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input
                type="number"
                placeholder="Classes Attended (default 0)"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Classes Absent (default 0)"
                value={absent}
                onChange={(e) => setAbsent(e.target.value)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <input
              type="number"
              placeholder="Hour Duration per Class (default 1)"
              value={hourDuration}
              onChange={(e) => setHourDuration(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddSubject}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Add Subject
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nameAsc">Name Ascending</option>
              <option value="nameDesc">Name Descending</option>
              <option value="attendanceAsc">Attendance Ascending</option>
              <option value="attendanceDesc">Attendance Descending</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-blue-500 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Total</h2>
          <p className="text-gray-600">
            Total Hours Attended: <span className="font-medium">{totalAttendedHours}</span>
          </p>
          <p className="text-gray-600">
            Total Hours Conducted: <span className="font-medium">{totalClassesHours}</span>
          </p>
          <p className="text-gray-600">
            Total Attendance Percentage:{" "}
            <span className="font-medium">{totalPercentage}%</span>
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {sortedSubjects.length > 0 ? (
            sortedSubjects.map((subj, index) => {
              const attendancePercentage = calculateAttendancePercentage(
                subj.attended,
                subj.absent,
                subj.hourDuration
              );
              const color = getColor(attendancePercentage);
              const borderColor =
                color === "red"
                  ? "border-red-500"
                  : color === "yellow"
                  ? "border-yellow-500"
                  : "border-green-500";
              const progressBarColor =
                color === "red"
                  ? "bg-red-500"
                  : color === "yellow"
                  ? "bg-yellow-500"
                  : "bg-green-500";
              return (
                <div key={index} className={`bg-white rounded-2xl shadow-md p-4 border-l-4 ${borderColor}`}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">{subj.name}</h2>
                    {subj.note && <span className="text-sm text-gray-500 italic">{subj.note}</span>}
                  </div>
                  <p className="text-gray-600">
                    Classes Attended: <span className="font-medium">{subj.attended}</span>
                  </p>
                  <p className="text-gray-600">
                    Classes Absent: <span className="font-medium">{subj.absent}</span>
                  </p>
                  <p className="text-gray-600">
                    Total Classes: <span className="font-medium">{subj.total}</span>
                  </p>
                  <p className="text-gray-600">
                    Hour Duration per Class: <span className="font-medium">{subj.hourDuration}</span>
                  </p>
                  <p className="text-gray-600">
                    Attendance Percentage: <span className="font-medium">{attendancePercentage}%</span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 my-2">
                    <div className={`h-3 rounded-full ${progressBarColor}`} style={{ width: `${attendancePercentage}%` }}></div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-2">
                    <button
                      onClick={() => handleEditSubject(index)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation(index)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      Delete
                    </button>
                  </div>
                  {editingIndex === index && (
                    <div className="mt-4">
                      <input
                        type="number"
                        placeholder="Edit Classes Attended"
                        value={editingAttended}
                        onChange={(e) => setEditingAttended(e.target.value)}
                        className="p-2 border rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <input
                        type="number"
                        placeholder="Edit Classes Absent"
                        value={editingAbsent}
                        onChange={(e) => setEditingAbsent(e.target.value)}
                        className="p-2 border rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <textarea
                        placeholder="Edit Note (optional)"
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        className="p-2 border rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                      <button
                        onClick={handleSaveEdit}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No subjects found.</p>
          )}
        </div>

        {isDeleteConfirmationVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-lg font-semibold">
                Are you sure you want to delete this subject?
              </h3>
              <div className="flex justify-end mt-4">
                <button
                  onClick={hideDeleteConfirmation}
                  className="mr-4 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubject}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default Subjects;
