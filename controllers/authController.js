const dotenv = require('dotenv');
const authService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Sadece prod'da secure olsun
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  console.log(req.headers)

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token eksik' });
  }

  try {
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict'
  });

  res.json({ message: 'Çıkış yapıldı' });
};
