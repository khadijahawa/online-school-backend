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
exports.getCourseById = async (courseId, user) => {
  try {
    const whereClause = { id: courseId };

    // Sadece öğretmense teacher_id'yi kontrol et
    if (user.role === 'teacher') {
      whereClause.teacher_id = user.teacherId;
    }

    const course = await db.Course.findOne({
      where: whereClause,
      include: [
        {
          model: db.Teacher,
          include: [db.User],
        },
        {
          model: db.Session,
        }
      ]
    });

    if (!course) throw new Error('Kurs bulunamadı');

    return course;
  } catch (err) {
    throw err;
  }
};

// Kursa oturum ekleme servisi
exports.addSessionToCourse = async (courseId, sessionData, user) => {
  try {
    const course = await db.Course.findByPk(courseId);

    if (!course) {
      throw new Error('Kurs bulunamadı');
    }

    // Eğer öğretmense ve bu kurs onun değilse, izin verme
    if (user.role === 'teacher' && course.teacher_id !== user.teacherId) {
      throw new Error('Bu kursa oturum ekleyemezsiniz');
    }

    const sessionCount = await db.Session.count({ where: { course_id: courseId } });

    const newSession = await db.Session.create({
      session_number: sessionCount + 1,
      course_id: courseId,
      ...sessionData
    });

    return newSession;
  } catch (error) {
    throw error;
  }
};

exports.markAttendance = async (sessionId, attendanceData, user) => {
  try {
    const session = await db.Session.findByPk(sessionId, {
      include: db.Course
    });
  
    if (!session) {
      throw new Error("Session not found");
    }
  
  // Eğer teacher ise ve kendi dersi değilse yetki hatası ver
    if (user.role === 'teacher' && session.Course.teacher_id !== user.teacherId) {
      throw new Error("Bu oturuma yoklama ekleme yetkiniz yok");
    }
  
  // Attendance ekleme
    for (const entry of attendanceData) {
      await session.addStudent(entry.studentId, {
        through: { attended: entry.attended }
      });
    }
  
    return { message: 'Yoklama başarıyla eklendi' };
  } catch (error) {
    throw error;
  }
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

const ALLOWED_STATUSES = ['active', 'inactive', 'archived'];

exports.updateCourse = async ({ courseId, payload, user }) => {
  const course = await db.Course.findByPk(courseId);
  if (!course) throw new Error('Course not found');

  // yetki kontrolü
  if (user.role === 'teacher') {
    if (!user.teacherId || course.teacher_id !== user.teacherId) {
      throw new Error('You cannot update this course');
    }
  }

  // Teacher hangi alanları güncelleyebilir?
  const updatableByTeacher = ['title', 'total_sessions'];
  const updatableByAdmin   = ['title', 'total_sessions', 'status', 'teacher_id'];

  const allowedFields = user.role === 'admin' ? updatableByAdmin : updatableByTeacher;

  // Status validasyonu (admin güncellerse)
  if (payload.status && !ALLOWED_STATUSES.includes(payload.status)) {
    throw new Error('Invalid status');
  }

  // Sadece izinli alanları bırak
  const updateData = {};
  for (const key of Object.keys(payload || {})) {
    if (allowedFields.includes(key)) updateData[key] = payload[key];
  }

  // değişecek bir şey yoksa
  if (Object.keys(updateData).length === 0) {
    return course; // no-op
  }

  await course.update(updateData);
  return course;
};


// Soft-delete (status=archived)
exports.archiveCourse = async ({ courseId, user }) => {
  if (user.role !== 'admin') {
    throw new Error('Only admin can archive courses');
  }
  const course = await db.Course.findByPk(courseId);
  if (!course) throw new Error('Course not found');

  await course.update({ status: 'archived' });
  return { archived: true, courseId: course.id };
};


// Hard-delete (ilişkiler yoksa)
exports.hardDeleteCourse = async ({ courseId, user }) => {
  if (user.role !== 'admin') {
    throw new Error('Only admin can hard-delete courses');
  }
  const course = await db.Course.findByPk(courseId);
  if (!course) throw new Error('Course not found');

  // ilişkileri kontrol et
  const sessionsCount = await db.Session.count({ where: { course_id: courseId } });
  const enrollmentsCount = await db.CourseStudent.count({ where: { course_id: courseId } });
  const teacherPaymentsCount = await db.TeacherPayment.count({ where: { course_id: courseId } });

  if (sessionsCount > 0 || enrollmentsCount > 0 || teacherPaymentsCount > 0) {
    throw new Error('Course has related data. Archive it instead of hard delete.');
  }

  await course.destroy();
  return { deleted: true, courseId };
};