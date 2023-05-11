/**
 * users.json dosyasında yinelenen email adresleri bulan script
 */

const fs = require('fs');

// users.json dosyasını oku
const data = fs.readFileSync('users.json');
const users = JSON.parse(data);

// emailList adında bir dizi oluştur
const emailList = users.map(user => user.email);

// yinelenen email adreslerini al
const duplicatedEmails = emailList.filter((email, index) => emailList.indexOf(email) !== index);

// yinelenen email adreslerini yazdır
if (duplicatedEmails.length > 0) {
  console.log('Yinelenen email adresleri: ', duplicatedEmails.join(', '));
} else {
  console.log('Dosyada yinelenen email adresi yok!');
}
