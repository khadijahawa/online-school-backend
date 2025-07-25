module.exports = (sequelize, DataTypes) => {
  const TeacherPayment = sequelize.define('TeacherPayment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isPaid: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_paid' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    tableName: 'teacher_payments',
  });

  TeacherPayment.associate = (models) => {
    TeacherPayment.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
    TeacherPayment.belongsTo(models.Course, { foreignKey: 'course_id' });
  };

  return TeacherPayment;
};
