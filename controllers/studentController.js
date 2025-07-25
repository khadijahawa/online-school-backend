const {Student, Course} = require('../models');

exports.addStudent = async (req, res) => {
  try {
    const { name, phone, email, is_new } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Öğrenci adı zorunludur' });
    }

    const newStudent = await Student.create({
      name,
      phone,
      email,
      is_new: is_new ?? true, // varsayılan true
    });

    res.status(201).json({ message: 'Öğrenci başarıyla eklendi', student: newStudent });
  } catch (error) {
    console.error('Öğrenci eklenirken hata:', error);
    res.status(500).json({ message: 'Öğrenci eklenirken bir hata oluştu' });
  }
};

//Öğrencileri listeleme
exports.getAllStudents = async (req, res) => {
    try {
      const students = await Student.findAll();
      res.json(students);
    } catch (error) {
      console.error('Öğrenciler alınamadı:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  };

// Öğrenci güncelleme
  exports.updateStudent = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, email, is_new } = req.body;
  
      const student = await Student.findByPk(id);
      if (!student) return res.status(404).json({ message: 'Öğrenci bulunamadı' });
  
      await student.update({ name, phone, email, is_new });
      res.json(student);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  };
  
// Öğrenci silme
exports.deleteStudent = async (req, res) => {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(id);
      if (!student) return res.status(404).json({ message: 'Öğrenci bulunamadı' });
  
      await student.destroy();
      res.json({ message: 'Öğrenci silindi' });
    } catch (error) {
      console.error('Silme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  };
  
// Öğrencinin kurslarını listeleme
  exports.getStudentCourses = async (req, res) => {
    const studentId = req.params.id;
  
    try {
      const student = await Student.findByPk(studentId, {
        include: {
          model: Course,
          through: { attributes: [] } // ara tabloyu gizler
        }
      });
  
      if (!student) {
        return res.status(404).json({ message: 'Öğrenci bulunamadı' });
      }
  
      res.json(student.Courses);
    } catch (error) {
      console.error('Kurslar alınamadı:', error);
      res.status(500).json({ message: 'Kurslar alınırken bir hata oluştu' });
    }
  };
  




  
  