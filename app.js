require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const courseRoutes = require('./routes/course');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');

// CORS ayarları
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Örnek: "http://localhost:5173"
  credentials: true, // cookie taşımak için gerekli
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// JSON body parse
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes); 
app.use('/admin', adminRoutes);
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
