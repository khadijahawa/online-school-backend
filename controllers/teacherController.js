const teacherService = require('../services/teacherService');

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherService.getAllTeachers();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: 'Teachers could not be retrieved' });
  }
};