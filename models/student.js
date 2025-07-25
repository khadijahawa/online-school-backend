module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    isNew: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_new' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    tableName: 'students',
  });

  Student.associate = (models) => {
    Student.belongsToMany(models.Course, {
      through: models.CourseStudent,
      foreignKey: 'student_id',
    });
    Student.belongsToMany(models.Session, {
      through: models.SessionStudent,
      foreignKey: 'student_id',
    });
  };
  

  return Student;
};

