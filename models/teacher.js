module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, 
      allowNull: false, 
      field: 'user_id' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    tableName: 'teachers',
  });

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, { foreignKey: 'user_id' });
    Teacher.hasMany(models.Course, { foreignKey: 'teacher_id' });
    Teacher.hasMany(models.TeacherPayment, { foreignKey: 'teacher_id' });
  };

  return Teacher;
};
