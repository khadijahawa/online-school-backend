require('dotenv').config();
const { Sequelize } = require('sequelize');

// Ortam değişkenlerini al
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || null,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
  }
);

// Bağlantıyı test et
sequelize.authenticate()
  .then(() => {
    console.log('✅ Veritabanına başarıyla bağlanıldı.');
  })
  .catch((err) => {
    console.error('❌ Veritabanı bağlantı hatası:', err);
  });
