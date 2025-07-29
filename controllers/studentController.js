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

exports.getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updated = await studentService.updateStudent(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
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
