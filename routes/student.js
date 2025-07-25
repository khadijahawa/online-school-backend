// routes/student.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const verifyToken  = require('../middleware/verifyToken');
const isAdmin  = require('../middleware/isAdmin');

// POST /students
router.post('/', verifyToken, isAdmin, studentController.addStudent);
router.get('/', verifyToken, isAdmin, studentController.getAllStudents);
router.put('/:id', verifyToken, isAdmin, studentController.updateStudent);
router.delete('/:id', verifyToken, isAdmin, studentController.deleteStudent);
router.get('/:id/courses', verifyToken, isAdmin, studentController.getStudentCourses);

module.exports = router;
