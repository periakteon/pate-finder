const fs = require("fs");
const { faker } = require("@faker-js/faker");
const axios = require("axios");

const loginEndpoint = "http://localhost:3000/api/auth/login";
const registerEndpoint = "http://localhost:3000/api/auth/register";
const addPostEndpoint = "http://localhost:3000/api/post/handlerPost";
const followEndpoint = "http://localhost:3000/api/follow/follow";

// TODO: Add pet to user, see handlerPet.ts

/**
 * 100 adet rastgele kullanıcı oluşturur ve users.json dosyasına kaydeder.
 */

const createUsers = async () => {
  const users = [];
  const usedEmails = new Set();
  const usedUserNames = new Set();

  for (let i = 0; i < 100; i++) {
    let username = faker.internet.userName();
    let email = faker.internet.email();

    while (usedEmails.has(email)) {
      console.warn(
        `Dikkat: ${email} adresi daha önce kullanıldı, yeni bir adres üretiliyor.`,
      );
      email = faker.internet.email();
    }

    usedEmails.add(email);

    while (username.length < 5 || usedUserNames.has(username)) {
      console.warn(
        `Dikkat: ${username} adresi daha önce kullanıldı veya 5 karakterden kisa, yeni bir username üretiliyor.`,
      );
      username = faker.internet.userName();
    }

    usedUserNames.add(username);

    const password = faker.internet.password();
    const user = { username, email, password };

    console.log(`Kullanıcı oluşturuldu: ${i}`);

    users.push(user);
  }

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  console.log("Kullanıcılar users.json dosyasına kaydedildi.");

  return users;
};

/**
 * 100 adet rastgele post oluşturur ve posts.json dosyasına kaydeder.
 */

const createPosts = async () => {
  const posts = [];

  for (let i = 0; i < 100; i++) {
    const post = {
      caption: faker.lorem.sentence(),
      postImage: faker.image.imageUrl(),
    };

    posts.push(post);
  }

  fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

  console.log("Postlar posts.json dosyasına kaydedildi.");
};

/**
 * 100 adet rastgele followingId oluşturur ve followings.json dosyasına kaydeder.
 */
const createFollowings = async () => {
  const followings = [];

  for (let i = 1; i < 101; i++) {
    const followingId = {
      followingId: i,
    };

    followings.push(followingId);
  }

  fs.writeFileSync("followings.json", JSON.stringify(followings, null, 2));
};

/**
 * users.json dosyasındaki kullanıcıları kaydeder.
 */

const apiRegisterUsers = async () => {
  const users = JSON.parse(fs.readFileSync("./users.json").toString());

  for (const user of users) {
    const response = await axios.post(registerEndpoint, {
      username: user.username,
      email: user.email,
      password: user.password,
    });

    console.log(`Kullanıcı ${user.username} kaydedildi:`, response.data);

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("Tüm kullanıcı kayıtları tamamlandı.");
};

const createCookies = async () => {
  const users = JSON.parse(fs.readFileSync("./users.json").toString());
  const cookies = [];

  for (const user of users) {
    const response = await axios.post(loginEndpoint, {
      email: user.email,
      password: user.password,
    });

    const token = response.data.token;
    const cookie = `token=${token}; HttpOnly; Path=/;`;

    cookies.push(cookie);
  }

  fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));
};

const apiPostRequest = async () => {
  const users = JSON.parse(fs.readFileSync("./users.json").toString());
  const posts = JSON.parse(fs.readFileSync("./posts.json").toString());
  const cookies = JSON.parse(fs.readFileSync("./cookies.json").toString());

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const cookie = cookies[i];

    for (let j = 0; j < posts.length; j++) {
      const post = posts[j];
      const addPostResponse = await axios.post(
        addPostEndpoint,
        {
          caption: post.caption,
          postImage: post.postImage,
        },
        {
          headers: {
            Cookie: cookie,
          },
        },
      );
      console.log(
        `User: ${user.email}, Post: ${j}, Status: ${addPostResponse.status}`,
      );
    }
  }
};

const apiFollowRequest = async () => {
  const users = JSON.parse(fs.readFileSync("./users.json").toString());
  const followingIds = JSON.parse(
    fs.readFileSync("./followings.json").toString(),
  );
  const cookies = JSON.parse(fs.readFileSync("./cookies.json").toString());

  for (let i = 0; i < users.length; i++) {
    const followingIdsWithoutUserId = followingIds.filter(
      (followingId) => followingId.followingId !== i + 1,
    );
    const randomFollowingIds = [];

    while (randomFollowingIds.length < 30) {
      const index = Math.floor(
        Math.random() * followingIdsWithoutUserId.length,
      );
      const followingId = followingIdsWithoutUserId.splice(index, 1)[0]
        .followingId;

      randomFollowingIds.push(followingId);
    }

    for (let j = 0; j < randomFollowingIds.length; j++) {
      const cookie = cookies[i];

      const followResponse = await axios.post(
        followEndpoint,
        { followingId: randomFollowingIds[j] },
        {
          headers: {
            Cookie: cookie,
          },
        },
      );

      console.log("Follow başarılı:", followResponse.data);
    }
  }
};

const main = async () => {
  try {
    await createUsers();
    await apiRegisterUsers();
    await createCookies();
    await createPosts();
    await apiPostRequest();
    await createFollowings();
    await apiFollowRequest();
  } catch (err) {
    console.error(err.message);
  }
};

main();
