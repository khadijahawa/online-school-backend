require('dotenv').config();
const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const courseRoutes = require('./routes/course');

// JSON body parse
app.use(express.json());

// Admin route
app.use('/admin', adminRoutes);
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
