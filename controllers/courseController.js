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
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('Kurslar alınamadı:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kurs ID ile kursu alma
exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).json({ message: 'Kurs bulunamadı' });
    }

    res.json(course);
  } catch (error) {
    console.error('Kurs alınamadı:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kursa yeni bir oturum ekleme
exports.addSessionToCourse = async (req, res) => {
  const courseId = req.params.id;
  const { date, topic, notes } = req.body;

  try {
    const newSession = await courseService.addSessionToCourse(courseId, { date, topic, notes });

    if (!newSession) {
      return res.status(404).json({ message: 'Kurs bulunamadı' });
    }

    res.status(201).json(newSession);
  } catch (error) {
    console.error('Session eklenemedi:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Oğrencilerin yoklamasını ekleme
exports.markAttendance = async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { attendance } = req.body;
      // attendance örneği: [{ studentId: 1, attended: true }, { studentId: 2, attended: false }]
  
      const session = await Session.findByPk(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
  
      for (const entry of attendance) {
        await session.addStudent(entry.studentId, {
          through: { attended: entry.attended },
        });
      }
  
      res.status(200).json({ message: 'Yoklama başarıyla eklendi' });
    } catch (err) {
      console.error('Yoklama hatası:', err);
      res.status(500).json({ message: 'Yoklama eklenemedi' });
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
  
  