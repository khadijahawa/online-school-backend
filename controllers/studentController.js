const studentService = require('../services/studentService');

exports.addStudent = async (req, res) => {
  try {
    const newStudent = await studentService.addStudent(req.body);
    res.status(201).json({ message: 'Öğrenci başarıyla eklendi', student: newStudent });
  } catch (error) {
    console.error('Öğrenci eklenirken hata:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({ message: 'Öğrenci silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const courses = await studentService.getStudentCourses(req.params.id);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const updated = await studentService.updateStudent({ id, payload: req.body, user });
    console.log('is_new in payload:', req.body.is_new, typeof req.body.is_new);
    res.json({ message: 'Student updated', student: updated });
  } catch (err) {
    console.error('Student update error:', err);
    res.status(400).json({ message: err.message || 'Update failed' });
  }
};

exports.listStudentsWithCourseCount = async (req, res) => {
  try {
    const { page, limit, q } = req.query;
    const result = await studentService.listStudentsWithCourseCount({ page, limit, q });
    res.json(result);
  } catch (err) {
    console.error('Students list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};