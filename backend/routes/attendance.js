const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const moment = require('moment');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST: Save a new attendance record with photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      studentName,
      studentId,
      yearLevel,
      course,
      dutyType,
      room,
      classStatus,
      facilitatorStatus,
      encodedTime,
      latitude,
      longitude,
      address,
    } = req.body;

    // Standardize encodedTime to ensure exact match (MM/DD/YYYY hh:mm A)
    const formattedTime = moment(encodedTime, 'MM/DD/YYYY hh:mm A').format('MM/DD/YYYY hh:mm A');
    console.log(`Checking for exact match: studentId=${studentId}, encodedTime=${formattedTime}`);

    // Check for exact same studentId and encodedTime
    const exactMatch = await Attendance.findOne({
      studentId,
      encodedTime: formattedTime,
    });

    if (exactMatch) {
      console.log(`Exact match found: ${JSON.stringify(exactMatch)}`);
      return res.status(400).json({ error: 'User already checked in at this exact time.' });
    }

    // Extract day from encodedTime
    const newRecordDay = moment(encodedTime, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DD');

    // Check for existing record with same studentId and day (for 5-minute rule)
    const existingRecord = await Attendance.findOne({
      studentId,
      encodedTime: { $regex: `^${newRecordDay}` },
    });

    if (existingRecord) {
      const existingTime = moment(existingRecord.encodedTime, 'MM/DD/YYYY hh:mm A');
      const newTime = moment(encodedTime, 'MM/DD/YYYY hh:mm A');
      const timeDiff = Math.abs(newTime.diff(existingTime, 'minutes'));

      if (timeDiff < 5) {
        console.log(`5-minute rule violation: timeDiff=${timeDiff} minutes`);
        return res.status(400).json({ error: 'User already checked in within 5 minutes on this day.' });
      }
    }

    // Include photo URL/path if uploaded
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newRecord = new Attendance({
      studentName,
      studentId,
      yearLevel,
      course,
      dutyType,
      room,
      classStatus,
      facilitatorStatus,
      encodedTime: formattedTime,
      photoUrl,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      address,
    });

    await newRecord.save();
    console.log(`Record saved: ${JSON.stringify(newRecord)}`);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error saving record:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all attendance records
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find();
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET: Search attendance records by query
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const records = await Attendance.find({
      $or: [
        { studentName: { $regex: query, $options: 'i' } },
        { studentId: { $regex: query, $options: 'i' } },
        { yearLevel: { $regex: query, $options: 'i' } },
        { course: { $regex: query, $options: 'i' } },
        { dutyType: { $regex: query, $options: 'i' } },
        { room: { $regex: query, $options: 'i' } },
        { classStatus: { $regex: query, $options: 'i' } },
        { facilitatorStatus: { $regex: query, $options: 'i' } },
        { encodedTime: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json(records);
  } catch (error) {
    console.error('Error searching records:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch latest record by studentId for auto-fill
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const record = await Attendance.findOne({ studentId }).sort({ createdAt: -1 });
    if (!record) {
      return res.status(404).json({ error: 'No record found for this Student ID.' });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching student data:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;