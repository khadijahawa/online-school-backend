const courseService = require('../services/courseService');

// Kurs oluşturma controllerı
exports.createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json({ message: 'Kurs oluşturuldu', course });
  } catch (error) {
    console.error('Kurs oluşturulurken hata:', error);
    res.status(500).json({ message: 'Kurs oluşturulamadı' });
  }
};

// Tüm kursları listeleme controllerı
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses(req.user);
    res.json(courses);
  } catch (error) {
    console.error('Kurslar alınamadı:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kurs ID ile kursu alma
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const course = await courseService.getCourseById(id, user);

    if (!course) {
      return res.status(404).json({ message: 'Kurs bulunamadı' });
    }

    res.json(course);
  } catch (error) {
    console.error('Kurs alınamadı:', error);
    res.status(404).json({ message: error.message || 'Sunucu hatası' });
  }
};

// Kursa yeni bir oturum ekleme
exports.addSessionToCourse = async (req, res) => {
  const courseId = req.params.id;
  const sessionData = req.body;
  const user = req.user;

  try {
    const newSession = await courseService.addSessionToCourse(courseId, sessionData, user);
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Session eklenemedi:', error);
    res.status(403).json({ message: error.message || 'Sunucu hatası' });
  }
};

// Oğrencilerin yoklamasını ekleme controllerı
exports.markAttendance = async (req, res) => {
  const { sessionId } = req.params;
  const { attendance } = req.body;
  const user = req.user;

  try {
    const result = await courseService.markAttendance(sessionId, attendance, user);
    res.status(200).json(result);
  } catch (err) {
    console.error('Yoklama hatası:', err);
    res.status(500).json({ message: err.message || 'Yoklama eklenemedi' });
  }
};

// Öğrenciyi kursa kaydetme
exports.enrollStudentToCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const { studentId } = req.body;

  try {
    const result = await courseService.enrollStudentToCourse(courseId, studentId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Kursa kayıt hatası:', error);
    res.status(500).json({ message: error.message || 'Sunucu hatası' });
  }
};
  
// PUT /courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const payload = req.body;
    const user = req.user; // verifyToken ile geliyor

    const updated = await courseService.updateCourse({ courseId, payload, user });
    res.json({ message: 'Course updated', course: updated });
  } catch (err) {
    console.error('Course update error:', err);
    res.status(400).json({ message: err.message || 'Update failed' });
  }
};

// DELETE /courses/:id  (soft-delete: archive)
exports.archiveCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = req.user;

    const result = await courseService.archiveCourse({ courseId, user });
    res.json({ message: 'Course archived', ...result });
  } catch (err) {
    console.error('Course archive error:', err);
    res.status(400).json({ message: err.message || 'Archive failed' });
  }
};

// DELETE /courses/:id/hard  (hard delete: ilişkiler yoksa)
exports.hardDeleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = req.user;

    const result = await courseService.hardDeleteCourse({ courseId, user });
    res.json({ message: 'Course hard-deleted', ...result });
  } catch (err) {
    console.error('Course hard delete error:', err);
    res.status(400).json({ message: err.message || 'Hard delete failed' });
  }
};
  
exports.removeStudentFromCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const user = req.user; // verifyToken’den geliyor
    const result = await courseService.removeStudentFromCourse({ courseId, studentId, user });

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    res.json({ message: result.message });
  } catch (err) {
    console.error('Remove student from course error:', err);
    res.status(400).json({ message: err.message || 'Operation failed' });
  }
};