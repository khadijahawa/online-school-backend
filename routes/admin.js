const express = require('express');
const router = express.Router(); 

const adminController = require('../controllers/adminController');
const courseController = require('../controllers/courseController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// POST /admin/login
router.post('/login', adminController.login);

// POST /admin/teachers
router.post('/teachers',verifyToken,isAdmin,adminController.addTeacher);

// POST /admin/courses
router.post('/courses', verifyToken, isAdmin, courseController.createCourse);


module.exports = router;
