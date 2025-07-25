require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || null,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Teacher = require('./teacher')(sequelize, Sequelize.DataTypes);
db.Student = require('./student')(sequelize, Sequelize.DataTypes);
db.Course = require('./course')(sequelize, Sequelize.DataTypes);
db.Session = require('./session')(sequelize, Sequelize.DataTypes);
db.CourseStudent = require('./courseStudent')(sequelize, Sequelize.DataTypes);
db.TeacherPayment = require('./teacherPayment')(sequelize, Sequelize.DataTypes);
db.SessionStudent = require('./sessionStudent')(sequelize, Sequelize.DataTypes);


// İlişkileri çalıştır
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
