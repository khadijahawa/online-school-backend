const userService = require('../services/userService');
const teacherService = require('../services/teacherService');

exports.addTeacher = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const teacher = await teacherService.createTeacherWithUser({ name, email, password });
    res.status(201).json({ message: 'Öğretmen eklendi', teacher });
  } catch (err) {
    console.error('Öğretmen eklenirken hata:', err);
    res.status(500).json({ message: err.message || 'Sunucu hatası' });
  }
};
