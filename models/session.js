module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    session_number: {
      type: DataTypes.INTEGER,
      allowNull: false, // bu varsa create sırasında değer ZORUNLU
    },
    date: DataTypes.DATE,
    topic: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('completed', 'cancelled'),
      defaultValue: 'completed'
    }
  }, {
    tableName: 'sessions',
    underscored: true
  });

  Session.associate = (models) => {
    Session.belongsTo(models.Course, { foreignKey: 'course_id' });
    Session.belongsToMany(models.Student, {
      through: models.SessionStudent,
      foreignKey: 'session_id',
    });
  };

  return Session;
};


