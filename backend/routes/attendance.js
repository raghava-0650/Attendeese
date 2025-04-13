// backend/routes/attendance.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// GET all attendance records
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new attendance record
router.post('/', async (req, res) => {
  const record = new Attendance({
    studentName: req.body.studentName,
    totalClasses: req.body.totalClasses,
    attendedClasses: req.body.attendedClasses,
  });
  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a record (for example, updating attended classes)
router.patch('/:id', async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    if (req.body.attendedClasses != null) {
      record.attendedClasses = req.body.attendedClasses;
    }
    // Similarly update other fields if needed

    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
