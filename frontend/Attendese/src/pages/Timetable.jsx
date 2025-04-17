import React, { useState } from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = () => {
  const [showSubjects, setShowSubjects] = useState(false);
  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('timetable');
    return saved ? JSON.parse(saved) : {
      Monday: [''],
      Tuesday: [''],
      Wednesday: [''],
      Thursday: [''],
      Friday: [''],
      Saturday: [''],
    };
  });

  const handleSubjectChange = (day, index, value) => {
    const updatedSubjects = [...timetable[day]];
    updatedSubjects[index] = value;
    setTimetable({ ...timetable, [day]: updatedSubjects });
  };

  const addSubject = (day) => {
    setTimetable({ ...timetable, [day]: [...timetable[day], ''] });
  };

  const saveTimetable = () => {
    localStorage.setItem('timetable', JSON.stringify(timetable));
    alert('Timetable saved!');
    setShowSubjects(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Weekly Timetable</h1>
        {!showSubjects && (
          <button
            onClick={() => setShowSubjects(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all"
          >
            + Add / Edit Subjects
          </button>
        )}
      </div>

      {!showSubjects ? (
        <>
          {/* --------- Initial View (Grid) --------- */}
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
                <tr>
                  {daysOfWeek.map((day) => (
                    <td
                      key={day}
                      className="border border-gray-300 min-h-[300px] h-[350px] p-4 text-gray-700 align-top"
                    >
                      <div className="flex flex-col gap-2">
                        {timetable[day].filter(s => s.trim() !== '').length > 0
                          ? timetable[day].map((subject, index) => (
                              <div
                                key={index}
                                className="py-2 border-b border-gray-300 last:border-b-0"
                              >
                                {subject || '-'}
                              </div>
                            ))
                          : <span className="text-gray-400">No subjects</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* --------- Subject Input View --------- */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="bg-white rounded-2xl shadow-md p-6 min-h-[350px] flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-purple-700 mb-3">{day}</h2>
                  {timetable[day].map((subject, index) => (
                    <input
                      key={index}
                      type="text"
                      value={subject}
                      onChange={(e) => handleSubjectChange(day, index, e.target.value)}
                      placeholder={`Subject ${index + 1}`}
                      className="mb-2 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  ))}
                </div>
                <button
                  onClick={() => addSubject(day)}
                  className="mt-2 text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-xl self-start"
                >
                  + Add Subject
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={saveTimetable}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-all"
            >
              💾 Save Timetable
            </button>
            <button
              onClick={() => setShowSubjects(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition-all"
            >
              ⬅️ Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Timetable;
