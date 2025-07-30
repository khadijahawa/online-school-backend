require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS
const dbHost = process.env.DB_HOST;
const dbPort =  5432;

console.log("DB_NAME:", dbName);
console.log("DB_USER:", dbUser);
console.log("DB_HOST:", dbHost);
console.log("DB_PORT:", dbPassword);
// 1. Ana bağlantı: postgres veritabanına bağlan ve veritabanı varsa oluşturma
const createDatabase = async () => {
  const client = new Client({
    user: dbUser,
    host: dbHost,
    database: "postgres", // sistem veritabanı
    password: dbPassword,   // sifren varsa burayı aç 
    port: dbPort,
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${dbName}'`
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Veritabanı "${dbName}" oluşturuldu.`);
    } else {
      console.log(`ℹ️ Veritabanı "${dbName}" zaten mevcut.`);
    }
  } catch (err) {
    console.error("❌ Veritabanı oluşturulamadı:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
};

// 2. init.sql dosyasını çalıştır
const runInitSQL = async () => {
  const sql = fs.readFileSync(path.join(__dirname, '../db/init.sql')).toString();

  const client = new Client({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,    //sifren varsa burayı aç
    port: dbPort,
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log("✅ Tablolar başarıyla kuruldu.");
  } catch (err) {
    console.error("❌ SQL çalıştırılırken hata oluştu:", err);
  } finally {
    await client.end();
  }
};

// Hepsini çalıştır
(async () => {
  //await createDatabase();
  await runInitSQL();
})();
