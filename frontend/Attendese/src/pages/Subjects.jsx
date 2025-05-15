import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { getAuth } from 'firebase/auth';

import Layout from '../components/Layout';

const auth = getAuth();

const Subjects = () => {
  const [subjectName, setSubjectName] = useState("");
  const [attended, setAttended] = useState("");
  const [absent, setAbsent] = useState("");
  const [hourDuration, setHourDuration] = useState("");
  const [note, setNote] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingAttended, setEditingAttended] = useState("");
  const [editingAbsent, setEditingAbsent] = useState("");
  const [editingNote, setEditingNote] = useState("");
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("nameAsc");

  // Fetch subjects when auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setSubjects([]);
        return;
      }
      try {
        const token = await user.getIdToken(true);
        const { data } = await axios.get(
          "http://localhost:4000/subjects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubjects(data);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    });
    return unsubscribe;
  }, []);

  // Coerce inputs to numbers before doing math
  const calculateAttendancePercentage = (att, abs, dur) => {
    const attendedNum = Number(att) || 0;
    const absentNum   = Number(abs) || 0;
    const hourNum     = Number(dur) || 1;
    const total       = attendedNum + absentNum;
    if (total === 0) return "0.00";
    const percent = (attendedNum * hourNum) / (total * hourNum) * 100;
    return percent.toFixed(2);
  };

  // Totals across all subjects
  const calculateTotalValues = () => {
    let totalAttendedHours = 0;
    let totalClassesHours  = 0;
    subjects.forEach((subj) => {
      const a = Number(subj.attended) || 0;
      const b = Number(subj.absent)   || 0;
      const h = Number(subj.hourDuration) || 1;
      totalAttendedHours += a * h;
      totalClassesHours  += (a + b) * h;
    });
    const totalPercentage =
      totalClassesHours === 0
        ? "0.00"
        : ((totalAttendedHours / totalClassesHours) * 100).toFixed(2);
    return { totalAttendedHours, totalClassesHours, totalPercentage };
  };

  // Color logic
  const getColor = (percentage) => {
    const p = parseFloat(percentage);
    if (p < 75) return "red";
    if (p < 90) return "yellow";
    return "green";
  };

  // Add new subject
  const handleAddSubject = async () => {
    if (!subjectName.trim()) return;
    const payload = {
      name:         subjectName.trim(),
      attended:     Number(attended) || 0,
      absent:       Number(absent)   || 0,
      hourDuration: Number(hourDuration) || 1,
      note:         note.trim(),
    };
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in to add a subject.");
      const token = await user.getIdToken(true);
      const res = await axios.post(
        "http://localhost:4000/subjects",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjects(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Error saving subject:", err);
    }
    // Reset form
    setSubjectName("");
    setAttended("");
    setAbsent("");
    setHourDuration("");
    setNote("");
    setIsAdding(false);
  };

  // Begin editing
  const handleEditSubject = (index) => {
    const subj = subjects[index];
    setEditingIndex(index);
    setEditingAttended(subj.attended);
    setEditingAbsent(subj.absent);
    setEditingNote(subj.note || "");
  };

  // Save edits locally (you could add a PUT call here too)
  const handleSaveEdit = () => {
    const updated = [...subjects];
    updated[editingIndex] = {
      ...updated[editingIndex],
      attended: Number(editingAttended) || 0,
      absent:   Number(editingAbsent)   || 0,
      note:     editingNote,
    };
    setSubjects(updated);
    setEditingIndex(null);
    setEditingAttended("");
    setEditingAbsent("");
    setEditingNote("");
  };

  // Delete subject locally (you could add a DELETE call here)
  const handleDeleteSubject = () => {
    setSubjects(subjects.filter((_, i) => i !== subjectToDelete));
    hideDeleteConfirmation();
  };
  const showDeleteConfirmation = (i) => {
    setIsDeleteConfirmationVisible(true);
    setSubjectToDelete(i);
  };
  const hideDeleteConfirmation = () => {
    setIsDeleteConfirmationVisible(false);
    setSubjectToDelete(null);
  };

  // Filter & sort
  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = filtered.sort((a, b) => {
    if (sortOption === "nameAsc")  return a.name.localeCompare(b.name);
    if (sortOption === "nameDesc") return b.name.localeCompare(a.name);
    const pA = parseFloat(calculateAttendancePercentage(a.attended, a.absent, a.hourDuration));
    const pB = parseFloat(calculateAttendancePercentage(b.attended, b.absent, b.hourDuration));
    if (sortOption === "attendanceAsc")  return pA - pB;
    if (sortOption === "attendanceDesc") return pB - pA;
    return 0;
  });

  const { totalAttendedHours, totalClassesHours, totalPercentage } = calculateTotalValues();

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">
          {/* Header & Add button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Subjects</h1>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              {isAdding ? "Cancel" : "Add Subject"}
            </button>
          </div>

          {/* Add form */}
          {isAdding && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Add Subject</h2>
              <input
                type="text"
                placeholder="Subject Name"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                autoFocus
                className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Optional Note"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="number"
                  placeholder="Classes Attended"
                  value={attended}
                  onChange={e => setAttended(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Classes Absent"
                  value={absent}
                  onChange={e => setAbsent(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <input
                type="number"
                placeholder="Hour Duration per Class"
                value={hourDuration}
                onChange={e => setHourDuration(e.target.value)}
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

          {/* Search & Sort */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg w-full sm:w-64 mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nameAsc">Name Ascending</option>
              <option value="nameDesc">Name Descending</option>
              <option value="attendanceAsc">Attendance Ascending</option>
              <option value="attendanceDesc">Attendance Descending</option>
            </select>
          </div>

          {/* Totals */}
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

          {/* Subject cards */}
          <div className="mt-8 space-y-4">
            {sorted.length > 0 ? (
              sorted.map((subj, idx) => {
                const pct = calculateAttendancePercentage(
                  subj.attended,
                  subj.absent,
                  subj.hourDuration
                );
                const color = getColor(pct);
                const borderColor =
                  color === "red" ? "border-red-500" :
                  color === "yellow" ? "border-yellow-500" :
                  "border-green-500";
                const barColor =
                  color === "red" ? "bg-red-500" :
                  color === "yellow" ? "bg-yellow-500" :
                  "bg-green-500";

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl shadow-md p-4 border-l-4 ${borderColor}`}
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-800">{subj.name}</h2>
                      {subj.note && (
                        <span className="text-sm text-gray-500 italic">{subj.note}</span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      Classes Attended: <span className="font-medium">{subj.attended}</span>
                    </p>
                    <p className="text-gray-600">
                      Classes Absent: <span className="font-medium">{subj.absent}</span>
                    </p>
                    <p className="text-gray-600">
                      Total Classes:{" "}
                      <span className="font-medium">
                        {Number(subj.attended) + Number(subj.absent)}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Hour Duration per Class: <span className="font-medium">{subj.hourDuration}</span>
                    </p>
                    <p className="text-gray-600">
                      Attendance Percentage: <span className="font-medium">{pct}%</span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3 my-2">
                      <div
                        className={`h-3 rounded-full ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-end space-x-4 mt-2">
                      <button
                        onClick={() => handleEditSubject(idx)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => showDeleteConfirmation(idx)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </div>

                    {/* In‑card edit form */}
                    {editingIndex === idx && (
                      <div className="mt-4">
                        <input
                          type="number"
                          placeholder="Edit Classes Attended"
                          value={editingAttended}
                          onChange={e => setEditingAttended(e.target.value)}
                          className="p-2 border rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="number"
                          placeholder="Edit Classes Absent"
                          value={editingAbsent}
                          onChange={e => setEditingAbsent(e.target.value)}
                          className="p-2 border rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <textarea
                          placeholder="Edit Note (optional)"
                          value={editingNote}
                          onChange={e => setEditingNote(e.target.value)}
                          className="p-2 border rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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

          {/* Delete confirmation modal */}
          {isDeleteConfirmationVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
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
