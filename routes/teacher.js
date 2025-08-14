const express = require('express');
const router = express.Router(); 

const teacherController = require('../controllers/teacherController'); 
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', verifyToken, isAdmin, teacherController.getTeachersWithCourses);

router.delete('/:id', verifyToken, isAdmin, teacherController.deleteTeacher);

module.exports = router;