const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

const SECRET_KEY = process.env.JWT_SECRET;

exports.loginAsAdmin = async (email, password) => {
  const user = await db.User.findOne({ where: { email, role: 'admin' } });

  if (!user) {
    throw new Error('Kullanıcı bulunamadı.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Şifre yanlış.');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: '1h',
  });

  return { token, user };
};
