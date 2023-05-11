/**
 * 100 adet random user generator
 */

const fs = require('fs');
const { faker } = require('@faker-js/faker');

let users = [];
let usedEmails = new Set();

for (let i = 0; i < 100; i++) {
  let username = faker.name.firstName();
  let email = faker.internet.email();
  while (usedEmails.has(email)) {
    console.log(`Dikkat: ${email} adresi daha önce kullanıldı, yeni bir adres üretiliyor.`);
    email = faker.internet.email();
  }
  usedEmails.add(email);
  let password = faker.internet.password();

  if (username.length < 5) {
    do {
      username = faker.name.firstName();
    } while (username.length < 5);
  }

  let user = {
    username: username,
    email: email,
    password: password,
  };
  console.log(`Kullanıcı oluşturuldu: ${i}`);
  users.push(user);
}

console.log("Çakışan e-postalar:", usedEmails);
const jsonUsers = JSON.stringify(users);

fs.writeFile('users.json', jsonUsers, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Kullanıcılar users.json dosyasına kaydedildi.');
});
