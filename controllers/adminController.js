const userService = require('../services/userService');
const teacherService = require('../services/teacherService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token } = await userService.loginAsAdmin(email, password);
    res.json({ message: 'Giriş başarılı', token });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message });
  }
};

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
