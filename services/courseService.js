const db = require('../models');

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
exports.getAllCourses = async () => {
try {
  const courses = await db.Course.findAll({
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
  
    const sessionCount = await db.Session.count({ where: { course_id: courseId } });
  
    const newSession = await db.Session.create({
      session_number: sessionCount + 1,
      course_id: courseId,
      ...sessionData,
    });
  
    return newSession;
  };
  
  

//Öğrenci kursa kaydetme servisi
const enrollStudentToCourse = async (courseId, studentId) => {
  const course = await db.Course.findByPk(courseId);
  if (!course) throw new Error('Kurs bulunamadı');

  const student = await db.Student.findByPk(studentId);
  if (!student) throw new Error('Öğrenci bulunamadı');

  await course.addStudent(student);
  return { message: 'Öğrenci başarıyla kursa kaydedildi' };
};

module.exports = {
  enrollStudentToCourse,
};
