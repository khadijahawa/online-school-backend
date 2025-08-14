const bcrypt = require('bcrypt');
const db = require('../models');
const { Op } = require('sequelize');

exports.createTeacherWithUser = async ({ name, email, password }) => {
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Bu email zaten kullanılıyor');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.User.create({
    name,
    email,
    password: hashedPassword,
    role: 'teacher',
  });

  const newTeacher = await db.Teacher.create({
    userId: newUser.id,
  });

  return newTeacher;
};

exports.getAllWithCourses = async ({ page = 1, limit = 20, q } = {}) => {
  const offset = (Number(page) - 1) * Number(limit);

  const userWhere = q
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
        ],
      }
    : {};

  const teachers = await db.Teacher.findAndCountAll({
    include: [
      {
        model: db.User,
        attributes: ['id', 'name', 'email', 'role'],
        where: userWhere,
      },
      {
        model: db.Course,
        attributes: ['id', 'title', 'course_no', 'status', 'total_sessions'],
        order: [['id', 'ASC']],
      },
    ],
    order: [['id', 'ASC']],
    limit: Number(limit),
    offset,
  });

  return {
    data: teachers.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: teachers.count,
      totalPages: Math.ceil(teachers.count / Number(limit)) || 1,
    },
  };
};


// Admin: öğretmen silme
// Kural: öğretmenin kursu/ödemesi varsa silME → önce kursları devret/arsivle
exports.deleteTeacherAdmin = async ({ teacherId }) => {
  const t = await db.sequelize.transaction();

  try {
    // 1) Sadece TEACHER satırını kilitle (include YOK!)
    const teacher = await db.Teacher.findByPk(teacherId, {
      transaction: t,
      lock: t.LOCK.UPDATE, // FOR UPDATE sadece Teacher için
    });

    if (!teacher) {
      await t.rollback();
      return { ok: false, status: 404, message: 'Teacher not found' };
    }

    // 2) User'ı ayrı çek (JOIN yok → FOR UPDATE hatası yok)
    const user = await db.User.findByPk(teacher.user_id, { transaction: t });

    // 3) İlişki kontrolü
    const [coursesCount, paymentsCount] = await Promise.all([
      db.Course.count({ where: { teacher_id: teacherId }, transaction: t }),
      db.TeacherPayment.count({ where: { teacher_id: teacherId }, transaction: t }),
    ]);

    if (coursesCount > 0 || paymentsCount > 0) {
      await t.rollback();
      return {
        ok: false,
        status: 400,
        message:
          'Teacher has related records (courses and/or payments). Reassign/archive courses and clear payments first.',
      };
    }

    // 4) Silme sırası: önce Teacher, sonra gerekirse User
    await teacher.destroy({ transaction: t });

    if (user && user.role === 'teacher') {
      // user başka amaçla tutulmayacaksa tamamen sil
      await db.User.destroy({ where: { id: user.id }, transaction: t });
      // Eğer aynı user ileride admin olabilir vs diyorsan, destroy yerine role değiştir:
      // await user.update({ role: 'inactive' }, { transaction: t });
    }

    await t.commit();
    return { ok: true, status: 200, message: 'Teacher deleted' };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};