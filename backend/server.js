const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();



const authRoutes = require('./routes/auth');
const scholarRoutes = require('./routes/scholar');
const dutyRoutes = require("./routes/duty");
const userRoutes = require("./routes/user");
const attendanceRoutes = require('./routes/attendance');
const checkerAttendanceRoutes = require('./routes/checkerAttendance');
const FaciAttendanceRoutes = require('./routes/FaciAttendance');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'Final-Project',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholars', scholarRoutes);
app.use("/api/duties", dutyRoutes);
app.use("/api/users", userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/checkerAttendance', checkerAttendanceRoutes);
app.use('/api/faci-attendance', FaciAttendanceRoutes);



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


