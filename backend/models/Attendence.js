// backend/models/Attendance.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const AttendanceSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  totalClasses: { type: Number, required: true },
  attendedClasses: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
