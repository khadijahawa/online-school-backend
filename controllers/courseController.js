const { Course, Teacher, Session, User } = require('../models');

exports.createCourse = async (req, res) => {
  try {
    const { title, course_no, total_sessions, teacher_id } = req.body;

    const course = await Course.create({
      title,
      course_no,
      total_sessions,
      teacher_id
    });

    res.status(201).json({ message: 'Kurs oluşturuldu', course });
  } catch (error) {
    console.error('Kurs oluşturulurken hata:', error);
    res.status(500).json({ message: 'Kurs oluşturulamadı' });
  }
};

// Tüm kursları listeleme
exports.getAllCourses = async (req, res) => {
    try {
      const courses = await Course.findAll({
        include: [
          {
            model: Teacher,
            include: [User] // öğretmenin User bilgileri
          },
          {
            model: Session
          }
        ]
      });
  
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
      const course = await Course.findByPk(id, {
        include: [
          {
            model: Teacher,
            include: ['User'], // öğretmenin kullanıcı bilgilerini de istersek
          },
          {
            model: Session,
          }
        ]
      });
  
      if (!course) {
        return res.status(404).json({ message: 'Kurs bulunamadı' });
      }
  
      res.json(course);
    } catch (error) {
      console.error('Kurs alınamadı:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  };

  exports.addSessionToCourse = async (req, res) => {
    const courseId = req.params.id;
    const { date, topic, notes } = req.body;
  
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Kurs bulunamadı' });
      }
  
      const sessionCount = await Session.count({ where: { course_id: courseId } });
  
      const newSession = await Session.create({
        session_number: sessionCount + 1,
        course_id: courseId,
        date,
        topic,
        notes
      });
  
      res.status(201).json(newSession);
    } catch (error) {
      console.error('Session eklenemedi:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  };

exports.markAttendance = async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { attendance } = req.body;
      // attendance örneği: [{ studentId: 1, attended: true }, { studentId: 2, attended: false }]
  
      const session = await db.Session.findByPk(sessionId);
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
  