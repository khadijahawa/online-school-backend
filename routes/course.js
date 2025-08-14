const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const isTeacherOrAdmin = require('../middleware/isTeacherOrAdmin');

router.get('/', verifyToken, isTeacherOrAdmin, courseController.getAllCourses);
router.get('/:id', verifyToken, isAdmin, courseController.getCourseById);
router.post('/:id/sessions', verifyToken, isTeacherOrAdmin, courseController.addSessionToCourse);
router.post('/sessions/:sessionId/attendance', verifyToken, isTeacherOrAdmin, courseController.markAttendance);
router.post('/:id/enroll', verifyToken, isAdmin, courseController.enrollStudentToCourse); 
// UPDATE (teacher kendi kursunda title/total_sessions; admin her şeyi)
router.put('/:id', verifyToken, courseController.updateCourse);
// SOFT DELETE (archive) — sadece admin
router.delete('/:id', verifyToken, isAdmin, courseController.archiveCourse);
// HARD DELETE — sadece admin + ilişkiler yoksa
router.delete('/:id/hard', verifyToken, isAdmin, courseController.hardDeleteCourse);
router.delete('/:courseId/students/:studentId', verifyToken, isAdmin, courseController.removeStudentFromCourse);

module.exports = router;
