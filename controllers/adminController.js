const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { User, Teacher } = require('../models');

const SECRET_KEY = process.env.JWT_SECRET;

// Admin giriş işlemi
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı bul
    const user = await db.User.findOne({ where: { email, role: 'admin' } });

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Şifreyi karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Şifre yanlış.' });
    }

    // Token oluştur
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.json({ message: 'Giriş başarılı', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Öğretmen ekleme işlemi
exports.addTeacher = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Aynı email varsa hata ver
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kullanılıyor' });
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // User oluştur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
    });

    // Teacher kaydı oluştur
    const newTeacher = await Teacher.create({
      userId: newUser.id,
    });

    res.status(201).json({ message: 'Öğretmen eklendi', teacher: newTeacher });

  } catch (err) {
    console.error('Öğretmen eklenirken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
