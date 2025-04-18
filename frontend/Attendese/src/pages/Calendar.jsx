// src/pages/Calendar.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  startOfMonth,
  subMonths,
} from 'date-fns';

import Layout from '../components/Layout';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({}); // Placeholder for attendance data

  useEffect(() => {
    // TODO: Fetch attendance data from backend for the selected month
    // Example dummy data to simulate real marked data
    const dummyData = {
      '2025-04-02': 'present',
      '2025-04-04': 'partial',
      '2025-04-06': 'absent',
    };
    setMarkedDates(dummyData);
  }, [currentDate]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getAttendanceStatus = (date) => {
    const key = format(date, 'yyyy-MM-dd');
    return markedDates[key] || 'unmarked';
  };

  const getDotColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'partial': return 'bg-blue-500';
      case 'absent': return 'bg-red-500';
      case 'unmarked': return 'bg-white border border-gray-300';
      default: return 'bg-gray-200';
    }
  };

  const handleDateClick = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    window.location.href = `/home?date=${formatted}`;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gray-100">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="text-xl text-purple-700 hover:text-purple-900"
          >
            {'<'}
          </button>

          <h1 className="text-2xl font-bold text-center text-purple-700">
            {format(currentDate, 'MMMM yyyy')}
          </h1>

          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="text-xl text-purple-700 hover:text-purple-900"
          >
            {'>'}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600 font-semibold mb-2">
          {weekdays.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {days.map((day, index) => {
            const status = getAttendanceStatus(day);
            const dotColor = getDotColor(status);
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`cursor-pointer flex flex-col items-center justify-between bg-white border rounded-xl shadow-sm py-4 hover:shadow-lg transition`}
              >
                <span className={isToday(day) ? 'text-purple-600 font-bold' : 'text-gray-800'}>
                  {format(day, 'd')}
                </span>
                <span className={`w-2 h-2 rounded-full mt-2 ${dotColor}`}></span>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
