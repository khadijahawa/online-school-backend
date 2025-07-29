const authService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(401).json({ message: err.message || 'Giriş başarısız' });
  }
};
