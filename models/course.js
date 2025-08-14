module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'course_no',
    },
    total_sessions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // eksi olmasın
      },
    },
    status: {
      type: DataTypes.STRING, // DB şemayı bozmamak için STRING bırakıyoruz
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'archived']], // enum davranışı
      },
    },
  }, {
    tableName: 'courses',
    underscored: true,
    indexes: [
      { unique: true, fields: ['course_no'] },
      { fields: ['teacher_id'] },
      { fields: ['status'] },
    ],
    defaultScope: {
      // İstersen archived’ları default gizleyebiliriz:
      // where: { status: { [sequelize.Sequelize.Op.ne]: 'archived' } }
    },
    scopes: {
      active: { where: { status: 'active' } },
      byTeacher(teacherId) { return { where: { teacher_id: teacherId } }; },
    },
  });

  Course.associate = (models) => {
    Course.belongsTo(models.Teacher, {
      foreignKey: 'teacher_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT', // hard delete koruması (ilişki varken silme)
    });

    Course.hasMany(models.Session, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT', // archiving tercih ettiğimiz için cascade yok
    });

    Course.belongsToMany(models.Student, {
      through: models.CourseStudent,
      foreignKey: 'course_id',
    });

    Course.hasMany(models.TeacherPayment, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  };

  return Course;
};
