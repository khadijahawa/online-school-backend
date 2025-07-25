function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetki yok (sadece admin)' });
    }
   // console.log("isadmin loaded")
    next();
  }
  
  module.exports = isAdmin;
  