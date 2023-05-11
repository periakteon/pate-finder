/**
 * 100 tane followingId nesnesi oluşturulur ve followings.json dosyasına yazılır.
 */

const fs = require('fs');

// FollowingId nesnelerini oluştur
const followings = [];
for (let i = 1; i < 101; i++) {
  const followingId = {
    "followingId": i,
  };
  followings.push(followingId);
}

// JSON dosyasına yaz
const json = JSON.stringify(followings);
fs.writeFile('followings.json', json, 'utf8', (err) => {
  if (err) {
    console.log('Hata oluştu: ', err);
  } else {
    console.log('Followings dosyası oluşturuldu.');
  }
});
