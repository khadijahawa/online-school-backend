const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbName = "okul_platformu";
const dbUser = "postgres";
const dbPassword = "senin_sifren"; // <- burayı değiştir eger sifren varsa
const dbHost = "localhost";
const dbPort = 5432;

// 1. Ana bağlantı: postgres veritabanına bağlan ve veritabanı varsa oluşturma
const createDatabase = async () => {
  const client = new Client({
    user: dbUser,
    host: dbHost,
    database: "postgres", // sistem veritabanı
    //password: dbPassword,   // sifren varsa burayı aç 
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
    //password: dbPassword,    sifren varsa burayı aç
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
  await createDatabase();
  await runInitSQL();
})();
