// src/pages/Subjects.jsx
import React, { useState } from 'react';
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

  const calculateAttendancePercentage = (attended, absent, hourDuration) => {
    const totalClasses = attended + absent;
    if (totalClasses === 0) return 0;
    const totalAttendedHours = attended * hourDuration;
    const totalClassesHours = totalClasses * hourDuration;
    return ((totalAttendedHours / totalClassesHours) * 100).toFixed(2);
  };

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

  const getColor = (percentage) => {
    const perc = parseFloat(percentage);
    if (perc < 75) return "red";
    else if (perc < 90) return "yellow";
    else return "green";
  };

  const handleAddSubject = async () => {
    if (!subjectName.trim()) return;
    const attendedCount = attended ? parseInt(attended) : 0;
    const absentCount = absent ? parseInt(absent) : 0;
    const newSubject = {
      name: subjectName,
      attended: attendedCount,
      absent: absentCount,
      total: attendedCount + absentCount,
      hourDuration: hourDuration ? parseFloat(hourDuration) : 1,
      note: note.trim(),
    };

    try {
      if (!auth.currentUser) throw new Error("You must be signed in to add a subject.");

      const idToken = await auth.currentUser.getIdToken(true);
      await axios.post('http://localhost:4000/subjects', newSubject, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

    } catch (error) {
      console.error(error);
    }

    setSubjects([...subjects, newSubject]);
    setSubjectName("");
    setAttended("");
    setAbsent("");
    setHourDuration("");
    setNote("");
    setIsAdding(false);
  };

  const handleEditSubject = (index) => {
    const subject = subjects[index];
    setEditingIndex(index);
    setEditingAttended(subject.attended);
    setEditingAbsent(subject.absent);
    setEditingNote(subject.note || "");
  };

  const handleSaveEdit = () => {
    const updatedSubjects = [...subjects];
    updatedSubjects[editingIndex] = {
      ...updatedSubjects[editingIndex],
      attended: parseInt(editingAttended),
      absent: parseInt(editingAbsent),
      total: parseInt(editingAttended) + parseInt(editingAbsent),
      note: editingNote,
    };
    setSubjects(updatedSubjects);
    setEditingIndex(null);
    setEditingAttended("");
    setEditingAbsent("");
    setEditingNote("");
  };

  const handleDeleteSubject = () => {
    const updatedSubjects = subjects.filter((_, i) => i !== subjectToDelete);
    setSubjects(updatedSubjects);
    setIsDeleteConfirmationVisible(false);
  };

  const showDeleteConfirmation = (index) => {
    setIsDeleteConfirmationVisible(true);
    setSubjectToDelete(index);
  };
  const hideDeleteConfirmation = () => {
    setIsDeleteConfirmationVisible(false);
    setSubjectToDelete(null);
  };

  const filteredSubjects = subjects.filter((subj) =>
    subj.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Subjects</h1>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              {isAdding ? "Cancel" : "Add Subject"}
            </button>
          </div>

          {isAdding && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Add Subject</h2>
              <input type="text" placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} autoFocus className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Optional Note" value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input type="number" placeholder="Classes Attended" value={attended} onChange={(e) => setAttended(e.target.value)} className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="number" placeholder="Classes Absent" value={absent} onChange={(e) => setAbsent(e.target.value)} className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <input type="number" placeholder="Hour Duration" value={hourDuration} onChange={(e) => setHourDuration(e.target.value)} className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={handleAddSubject} className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                Add Subject
              </button>
            </div>
          )}

          <div className="overflow-x-auto whitespace-nowrap flex gap-6">
            <div className="bg-white min-w-[320px] max-w-[320px] rounded-2xl shadow-lg p-5 border-l-4 border-blue-500 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Total Attendance</h2>
              <p className="text-gray-600">Total Attended Hours: <span className="font-medium">{totalAttendedHours}</span></p>
              <p className="text-gray-600">Total Classes Hours: <span className="font-medium">{totalClassesHours}</span></p>
              <p className="text-gray-600">Attendance %: <span className="font-bold">{totalPercentage}%</span></p>
            </div>
            {sortedSubjects.map((subj, index) => {
              const attendancePercentage = calculateAttendancePercentage(subj.attended, subj.absent, subj.hourDuration);
              const color = getColor(attendancePercentage);
              const borderColor = color === "red" ? "border-red-500" : color === "yellow" ? "border-yellow-500" : "border-green-500";
              const progressBarColor = color === "red" ? "bg-red-500" : color === "yellow" ? "bg-yellow-500" : "bg-green-500";

              return (
                <div key={index} className={`bg-white min-w-[320px] max-w-[320px] rounded-2xl shadow-lg p-5 border-l-4 ${borderColor} flex-shrink-0`}>
                  <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">{subj.name}</h2>
                  {subj.note && <p className="text-sm text-gray-500 italic mb-2">{subj.note}</p>}
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>Attended: <span className="font-medium">{subj.attended}</span></p>
                    <p>Absent: <span className="font-medium">{subj.absent}</span></p>
                    <p>Total: <span className="font-medium">{subj.total}</span></p>
                    <p>Hours/Class: <span className="font-medium">{subj.hourDuration}</span></p>
                    <p>Attendance %: <span className="font-bold">{attendancePercentage}%</span></p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 my-2">
                    <div className={`h-2 rounded-full ${progressBarColor}`} style={{ width: `${attendancePercentage}%` }}></div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-3 text-sm">
                    <button onClick={() => handleEditSubject(index)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => showDeleteConfirmation(index)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subjects;
