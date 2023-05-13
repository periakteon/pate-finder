const fs = require('fs').promises;

async function findDuplicatedEmails() {
  try {
    // users.json dosyasını oku
    const data = await fs.readFile('users.json', 'utf-8');
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
  } catch (error) {
    console.error('Bir hata oluştu:', error);
  }
}

findDuplicatedEmails();
