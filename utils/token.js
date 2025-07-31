const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';

exports.createAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' });
};

exports.createRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};
