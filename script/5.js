/**
 * Kullanıcıları kayıt etmek için kullanılan script.
 */

const fs = require("fs");
const axios = require("axios");

const users = JSON.parse(fs.readFileSync("./users.json"));

async function registerUsers(users) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const data = {
      username: user.username,
      email: user.email,
      password: user.password
    };

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', data);
      console.log(`Kullanıcı ${i} kaydedildi:`, response.data);
    } catch (error) {
      console.error(`Kullanıcı ${i} ${(user.email)} kaydedilirken HATA oluştu:`, error.response.data);
    }

    await new Promise(resolve => setTimeout(resolve, 0010));
  }
  
  console.log('Tüm kullanıcı kayıtları tamamlandı!');
}

registerUsers(users);
