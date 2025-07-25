module.exports = (sequelize, DataTypes) => {
  const CourseStudent = sequelize.define('CourseStudent', {
    hasPaid: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'has_paid' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    tableName: 'course_students',
  });

  return CourseStudent;
};
