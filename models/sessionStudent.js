// models/sessionStudent.js
module.exports = (sequelize, DataTypes) => {
    const SessionStudent = sequelize.define('SessionStudent', {
      attended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      tableName: 'session_students',
      underscored: true,
    });
  
    return SessionStudent;
  };
  
