const db = require('../models');
const teacher = require('../models/teacher');

// Kurs oluşturma servisi
exports.createCourse = async ({ title, course_no, total_sessions, teacher_id }) => {
    try {
      const course = await db.Course.create({
        title,
        course_no,
        total_sessions,
        teacher_id
      });
      return course;
    } catch (error) {
      throw error;
    }
  };

// Tüm kursları listeleme servisi
exports.getAllCourses = async (user) => {
  try {
    let whereCondition = {};

    // Eğer teacher ise sadece kendi kurslarını getirsin
    if (user.role === 'teacher') {
      if (!user.teacherId) {
        throw new Error("Teacher ID bulunamadı");
      }
      whereCondition.teacher_id = user.teacherId;
    }

    const courses = await db.Course.findAll({
      where: whereCondition,
      include: [
        {
          model: db.Teacher,
          include: [db.User]
        },
        {
          model: db.Session
        }
      ]
    });

    return courses;
  } catch (error) {
    throw error;
  }
};


// Kurs ID ile kursu alma servisi
exports.getCourseById = async (id) => {
    try {
      const course = await db.Course.findByPk(id, {
        include: [
          {
            model: db.Teacher,
            include: [db.User],
          },
          {
            model: db.Session,
          },
        ],
      });
  
      return course;
    } catch (error) {
      throw error;
    }
  };

// Kursa oturum ekleme servisi
exports.addSessionToCourse = async (courseId, sessionData) => {
    const course = await db.Course.findByPk(courseId);
    if (!course) {
      return null;
    }
    if (req.user.role === 'teacher' && course.teacher_id !== req.user.id) {
      return res.status(403).json({ message: 'Bu kursa oturum ekleyemezsiniz' });
    }
    const sessionCount = await db.Session.count({ where: { course_id: courseId } });
  
    const newSession = await db.Session.create({
      session_number: sessionCount + 1,
      course_id: courseId,
      ...sessionData,
    });
  
    return newSession;
  };
  
// Kursa ait oturumlarda yoklama alma servisi 
exports.markAttendance = async (sessionId, attendance) => {
    const session = await db.Session.findByPk(sessionId);
    if (!session) return null;
  
    for (const entry of attendance) {
      await session.addStudent(entry.studentId, {
        through: { attended: entry.attended },
      });
    }
  
    return true;
  };  

//Öğrenci kursa kaydetme servisi
exports.enrollStudentToCourse = async (courseId, studentId) => {
  const course = await db.Course.findByPk(courseId);
  if (!course) throw new Error('Kurs bulunamadı');

  const student = await db.Student.findByPk(studentId);
  if (!student) throw new Error('Öğrenci bulunamadı');

  await course.addStudent(student);
  return { message: 'Öğrenci başarıyla kursa kaydedildi' };
};

