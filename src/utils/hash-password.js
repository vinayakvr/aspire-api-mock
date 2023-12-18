const bcrypt = require('bcrypt');
// const crypto = require('crypto');

// function generateSalt() {
//   return new Promise((resolve, reject) => {
//     crypto.randomBytes(16, (err, buffer) => {
//       if (err) reject(err);
//       resolve(buffer.toString('hex')); // Convert buffer to hex string
//     });
//   });
// }


async function hashPassword(password) {
  console.log('input', password);
  // const salt = await generateSalt();
  const hash = await bcrypt.hash(password, 10);
  console.log('output', hash);
  return hash;
}

module.exports = {
  hashPassword,
}
