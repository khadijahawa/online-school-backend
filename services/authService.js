const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { createAccessToken, createRefreshToken } = require('../utils/token');
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';

exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Şifre yanlış');
  }

  const payload = { id: user.id, role: user.role };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

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