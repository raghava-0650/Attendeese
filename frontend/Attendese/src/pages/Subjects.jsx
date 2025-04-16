import React, { useState } from "react";

const Subjects = () => {
  const [subjectName, setSubjectName] = useState("");
  const [attended, setAttended] = useState("");
  const [absent, setAbsent] = useState("");
  const [hourDuration, setHourDuration] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingAttended, setEditingAttended] = useState("");
  const [editingAbsent, setEditingAbsent] = useState("");
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  // Calculate attendance percentage for each subject
  const calculateAttendancePercentage = (attended, absent, hourDuration) => {
    const totalClasses = attended + absent;
    if (totalClasses === 0) return 0; // Avoid division by zero

    const totalAttendedHours = attended * hourDuration;
    const totalClassesHours = totalClasses * hourDuration;

    return ((totalAttendedHours / totalClassesHours) * 100).toFixed(2);
  };

  // Calculate the total values for all subjects
  const calculateTotalValues = () => {
    let totalAttendedHours = 0;
    let totalClassesHours = 0;

    subjects.forEach((subj) => {
      totalAttendedHours += subj.attended * subj.hourDuration;
      totalClassesHours += (subj.attended + subj.absent) * subj.hourDuration;
    });

    const totalPercentage = calculateAttendancePercentage(
      totalAttendedHours,
      totalClassesHours - totalAttendedHours,
      1 // For total percentage calculation, we can just use `1` as hour duration doesn't matter
    );

    return {
      totalAttendedHours,
      totalClassesHours,
      totalPercentage,
    };
  };

  // Handle adding a new subject
  const handleAddSubject = () => {
    if (!subjectName.trim()) return;

    const attendedCount = attended ? parseInt(attended) : 0;
    const absentCount = absent ? parseInt(absent) : 0;

    const newSubject = {
      name: subjectName,
      attended: attendedCount,
      absent: absentCount,
      total: attendedCount + absentCount,
      hourDuration: hourDuration ? parseFloat(hourDuration) : 1,
    };

    setSubjects([...subjects, newSubject]);

    // Reset the input fields
    setSubjectName("");
    setAttended("");
    setAbsent("");
    setHourDuration("");
    setIsAdding(false);
  };

  // Handle editing a subject's attended and absent values
  const handleEditSubject = (index) => {
    const subject = subjects[index];
    setEditingIndex(index);
    setEditingAttended(subject.attended);
    setEditingAbsent(subject.absent);
  };

  // Save the changes after editing
  const handleSaveEdit = () => {
    const updatedSubjects = [...subjects];
    updatedSubjects[editingIndex].attended = parseInt(editingAttended);
    updatedSubjects[editingIndex].absent = parseInt(editingAbsent);
    setSubjects(updatedSubjects);

    // Reset the edit state
    setEditingIndex(null);
    setEditingAttended("");
    setEditingAbsent("");
  };

  // Handle deleting a subject
  const handleDeleteSubject = () => {
    const updatedSubjects = subjects.filter((_, i) => i !== subjectToDelete);
    setSubjects(updatedSubjects);
    setIsDeleteConfirmationVisible(false);
  };

  // Show delete confirmation
  const showDeleteConfirmation = (index) => {
    setIsDeleteConfirmationVisible(true);
    setSubjectToDelete(index);
  };

  // Hide delete confirmation
  const hideDeleteConfirmation = () => {
    setIsDeleteConfirmationVisible(false);
    setSubjectToDelete(null);
  };

  const { totalAttendedHours, totalClassesHours, totalPercentage } =
    calculateTotalValues();

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <div className="flex items-center">
            <p className="text-gray-600 mr-4">Total Attendance: {totalPercentage}%</p>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition"
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
              className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition"
            >
              Add Subject
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-blue-500 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Total</h2>
          <p className="text-gray-600">
            Total Hours Attended: <span className="font-medium">{totalAttendedHours}</span>
          </p>
          <p className="text-gray-600">
            Total Hours Happened: <span className="font-medium">{totalClassesHours}</span>
          </p>
          <p className="text-gray-600">
            Total Attendance Percentage:{" "}
            <span className="font-medium">{totalPercentage}%</span>
          </p>
        </div>

        <div className="mt-8 max-w-xl mx-auto space-y-4">
          {subjects.length > 0 ? (
            subjects.map((subj, index) => {
              const attendancePercentage = calculateAttendancePercentage(
                subj.attended,
                subj.absent,
                subj.hourDuration
              );

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-blue-500"
                >
                  <h2 className="text-xl font-bold text-gray-800">{subj.name}</h2>
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
                  <div className="flex justify-end space-x-4 mt-2">
                    <button
                      onClick={() => handleEditSubject(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation(index)}
                      className="text-red-600 hover:text-red-800"
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
                      <button
                        onClick={handleSaveEdit}
                        className="w-full bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No subjects added yet.</p>
          )}
        </div>

        {isDeleteConfirmationVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-lg font-semibold">Are you sure you want to delete this subject?</h3>
              <div className="flex justify-end mt-4">
                <button
                  onClick={hideDeleteConfirmation}
                  className="mr-4 text-gray-600 hover:text-gray-800"
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
  );
};

export default Subjects;
