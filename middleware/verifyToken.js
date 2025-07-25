// middlewares/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // .env dosyasını okumak için

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token gerekli' });
  }

  // Token şu şekilde gelmeli: "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Geçersiz token' });
    }

    req.user = decoded; // decoded = { id, email, role, ... }
   // console.log("verifyToken loaded")
    next(); // her şey doğruysa bir sonraki adıma geç
  });
}

module.exports = verifyToken;

