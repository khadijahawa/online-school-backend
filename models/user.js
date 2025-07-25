module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.TEXT,
    role: DataTypes.ENUM('admin', 'teacher'),
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    tableName: 'users',
  });

  User.associate = (models) => {
    User.hasOne(models.Teacher, { foreignKey: 'user_id' });
  };

  return User;
};
