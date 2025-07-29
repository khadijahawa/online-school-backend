const bcrypt = require('bcrypt');
const db = require('../models');

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
