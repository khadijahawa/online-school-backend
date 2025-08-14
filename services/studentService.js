const db = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.addStudent = async (data) => {
  const { name, phone, email, is_new } = data;
  if (!name) throw new Error('Öğrenci adı zorunludur');

  return await db.Student.create({
    name,
    phone,
    email,
    is_new: is_new ?? true,
  });
};
exports.deleteStudent = async (id) => {
  const student = await db.Student.findByPk(id);
  if (!student) throw new Error('Öğrenci bulunamadı');

  await student.destroy();
};

exports.getStudentCourses = async (id) => {
  const student = await db.Student.findByPk(id, {
    include: {
      model: db.Course,
      through: { attributes: [] },
    },
  });
  if (!student) throw new Error('Öğrenci bulunamadı');

  return student.Courses;
};

// Admin: öğrenci güncelleme
exports.updateStudent = async ({ id, payload, user }) => {
  if (user.role !== 'admin') throw new Error('Only admin can update students');

  const student = await db.Student.findByPk(id);
  if (!student) throw new Error('Student not found');

  const allowed = ['name', 'phone', 'email', 'is_new'];
  const data = {};
  for (const k of Object.keys(payload || {})) {
    if (allowed.includes(k)) data[k] = payload[k];
  }
  if (Object.keys(data).length === 0) return student;

  await student.update(data);
  return student;
};


// Öğrencileri toplam kurs sayısıyla listeleme (+ arama + sayfalama)
exports.listStudentsWithCourseCount = async ({ page = 1, limit = 20, q }) => {
  const where = q
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
          { phone: { [Op.iLike]: `%${q}%` } },
        ],
      }
    : {};

  const offset = (Number(page) - 1) * Number(limit);

  // Toplam öğrenci sayısı (pagination için)
  const total = await db.Student.count({ where });

  // Kurs sayısı için LEFT JOIN + COUNT(DISTINCT)
  const rows = await db.Student.findAll({
    where,
    include: [
      {
        model: db.Course,
        attributes: [],           // join için
        through: { attributes: [] }
      },
    ],
    attributes: {
      include: [
        [fn('COUNT', literal('DISTINCT "Courses"."id"')), 'course_count'],
      ],
    },
    group: ['Student.id'],
    order: [['id', 'ASC']],
    limit: Number(limit),
    offset,
    subQuery: false,
  });

  return {
    data: rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};