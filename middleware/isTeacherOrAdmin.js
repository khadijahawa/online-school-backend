function isTeacherOrAdmin(req, res, next){
    if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher')) {
      return next();
    }
    return res.status(403).json({ message: 'Yetkiniz yok' });
  };
  
  module.exports = isTeacherOrAdmin;