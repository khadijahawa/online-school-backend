// routes/temp.js
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    res.status(201).json({ message: '✅ Admin başarıyla oluşturuldu.', admin });
  } catch (err) {
    console.error('Admin oluşturulamadı:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
