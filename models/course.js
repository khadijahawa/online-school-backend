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
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
  }, {
    tableName: 'courses',
    underscored: true, // created_at, updated_at gibi alanlar için
  });

  Course.associate = (models) => {
    Course.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
    Course.hasMany(models.Session, { foreignKey: 'course_id' });
    Course.belongsToMany(models.Student, {
      through: models.CourseStudent,
      foreignKey: 'course_id',
    });
    Course.hasMany(models.TeacherPayment, { foreignKey: 'course_id' });
  };

  return Course;
};
