const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Teacher } = require('../models');
const { createAccessToken, createRefreshToken } = require('../utils/token');
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';

exports.login = async (email, password) => {
  // 1. Kullanıcıyı bul
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }

  // 2. Şifreyi doğrula
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Şifre yanlış');
  }

  // 3. Payload oluştur
  const payload = {
    id: user.id,
    role: user.role,
  };

  // 4. Eğer öğretmense, teacherId’yi payload’a ekle
  if (user.role === 'teacher') {
    const teacher = await Teacher.findOne({ where: { userId: user.id } });
    if (!teacher) {
      throw new Error('Teacher kaydı bulunamadı');
    }

    payload.teacherId = teacher.id;
    console.log('Öğretmen ID:', payload.teacherId);
  }

  // 5. Token oluştur
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  // 6. Dön
  return { accessToken, refreshToken };
};

exports.refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = createAccessToken({ id: decoded.id, role: decoded.role });
    return newAccessToken;
  } catch (err) {
    throw new Error('Geçersiz veya süresi dolmuş refresh token');
  }
};