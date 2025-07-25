const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', verifyToken, isAdmin, courseController.getAllCourses);
router.get('/:id', verifyToken, isAdmin, courseController.getCourseById);
router.post('/:id/sessions', verifyToken, isAdmin, courseController.addSessionToCourse);
router.post('/sessions/:sessionId/attendance', verifyToken, isAdmin, courseController.markAttendance);



module.exports = router;
