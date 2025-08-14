const teacherService = require('../services/teacherService');


// GET /teachers  (öğretmenler + kursları)
exports.getTeachersWithCourses = async (req, res) => {
  try {
    const { page, limit, q } = req.query;
    const result = await teacherService.getAllWithCourses({ page, limit, q });
    res.json(result);
  } catch (err) {
    console.error('Öğretmenler alınamadı:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// DELETE /teachers/:id  (admin)
exports.deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;

    const result = await teacherService.deleteTeacherAdmin({ teacherId });
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    res.json({ message: result.message });
  } catch (err) {
    console.error('Teacher delete error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};