/**
 * 100 tane post nesnesi oluşturulur ve posts.json dosyasına yazılır.
 */

const fs = require('fs');
const { faker } = require('@faker-js/faker');

const posts = [];

for (let i = 0; i < 100; i++) {
  const post = {
    caption: faker.lorem.sentence(),
    postImage: faker.image.imageUrl(),
  };

  posts.push(post);
}

const jsonPosts = JSON.stringify(posts);

fs.writeFile('posts.json', jsonPosts, err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Postlar posts.json dosyasına kaydedildi.');
});
