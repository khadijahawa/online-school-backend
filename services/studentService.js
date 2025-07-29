const db = require('../models');

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

exports.getAllStudents = async () => {
  return await db.Student.findAll();
};

exports.updateStudent = async (id, data) => {
  const student = await db.Student.findByPk(id);
  if (!student) throw new Error('Öğrenci bulunamadı');

  return await student.update(data);
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
