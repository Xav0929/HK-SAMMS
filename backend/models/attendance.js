const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  yearLevel: { type: String, required: true },
  course: { type: String, required: true },
  dutyType: { type: String, required: true },
  room: { type: String, required: true },
  classStatus: { type: String },
  facilitatorStatus: { type: String },
  encodedTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  photoUrl: { type: String }, // URL or path to the uploaded photo
  latitude: { type: Number }, // Latitude of the location
  longitude: { type: Number }, // Longitude of the location
  address: { type: String }, // Address from reverse geocoding
});

module.exports = mongoose.model('Attendance', attendanceSchema);