const bcrypt = require('bcrypt');

const password = '123456'; // düz şifre
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashlenmiş şifre:', hash);
});
