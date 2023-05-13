const fs = require("fs").promises;
const { faker } = require("@faker-js/faker");

const generateRandomUsers = async () => {
  const users = [];
  const usedEmails = new Set();

  for (let i = 0; i < 100; i++) {
    let username = faker.internet.userName();
    let email = faker.internet.email();

    while (usedEmails.has(email)) {
      console.warn(
        `Dikkat: ${email} adresi daha önce kullanıldı, yeni bir adres üretiliyor.`
      );
      email = faker.internet.email();
    }

    usedEmails.add(email);

    if (username.length < 5) {
      username = faker.name.firstName();
    }

    const password = faker.internet.password();
    const user = { username, email, password };

    console.log(`Kullanıcı oluşturuldu: ${i}`);
    users.push(user);
  }

  console.log("Çakışan e-postalar:", usedEmails);

  try {
    await fs.writeFile("users.json", JSON.stringify(users));
    console.log("Kullanıcılar users.json dosyasına kaydedildi.");
  } catch (err) {
    console.error(err);
  }
};

generateRandomUsers();