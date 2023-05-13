const fs = require("fs");
const qs = require("qs");
const { faker } = require("@faker-js/faker");
const axios = require("axios").default;
axios.defaults.maxSockets = Infinity;

const loginEndpoint = "http://localhost:3000/api/auth/login";
const registerEndpoint = "http://localhost:3000/api/auth/register";
const addPostEndpoint = "http://localhost:3000/api/post/handlerPost";
const followEndpoint = "http://localhost:3000/api/follow/follow";

/**
 * 100 adet rastgele kullanıcı oluşturur ve users.json dosyasına kaydeder.
 */

const generateRandomUsers = async () => {
  const users = [];
  const usedEmails = new Set();

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
    fs.writeFileSync("users.json", JSON.stringify(users));
    console.log("Kullanıcılar users.json dosyasına kaydedildi.");
    return users;
  } catch (err) {
    console.error(err);
  }
};

/**
 * users.json dosyasındaki kullanıcıların email adreslerini kontrol eder ve
 * yinelenen email adreslerini bulur.
 */

const findDuplicatedEmails = async (users) => {
  try {
    // emailList adında bir dizi oluştur
    const emailList = users.map((user) => user.email);

    // yinelenen email adreslerini al
    const duplicatedEmails = emailList.filter(
      (email, index) => emailList.indexOf(email) !== index,
    );

    // yinelenen email adreslerini yazdır
    if (duplicatedEmails.length > 0) {
      console.log("Yinelenen email adresleri: ", duplicatedEmails.join(", "));
    } else {
      console.log("Dosyada yinelenen email adresi yok!");
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

/**
 * 100 adet rastgele post oluşturur ve posts.json dosyasına kaydeder.
 */

const createPosts = async () => {
  try {
    const posts = [];

    for (let i = 0; i < 100; i++) {
      const post = {
        caption: faker.lorem.sentence(),
        postImage: faker.image.imageUrl(),
      };

      posts.push(post);
    }

    const jsonPosts = JSON.stringify(posts);

    fs.writeFileSync("posts.json", jsonPosts);
    console.log("Postlar posts.json dosyasına kaydedildi.");
    return posts;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

/**
 * 100 adet rastgele followingId oluşturur ve followings.json dosyasına kaydeder.
 */
const createFollowings = async () => {
  try {
    // FollowingId nesnelerini oluştur
    const followings = [];
    for (let i = 1; i < 101; i++) {
      const followingId = {
        followingId: i,
      };
      followings.push(followingId);
    }

    // JSON dosyasına yaz
    const json = JSON.stringify(followings);
    fs.writeFileSync("followings.json", json, "utf8");
    console.log("Followings dosyası oluşturuldu.");
    return followings;
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

/**
 * users.json dosyasındaki kullanıcıları kaydeder.
 */

const registerUsers = async () => {
  try {
    const users = require("./users.json");

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const data = {
        username: user.username,
        email: user.email,
        password: user.password,
      };

      try {
        const response = await axios.post(registerEndpoint, data);
        console.log(`Kullanıcı ${i} kaydedildi:`, response.data);
      } catch (error) {
        console.error(
          `Kullanıcı ${i} ${user.email} kaydedilirken HATA oluştu:`,
          error.response.data,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("Tüm kullanıcı kayıtları tamamlandı.");
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

const postRequest = async (posts) => {
  try {
    const users = require("./users.json");
    const posts = require("./posts.json");
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const response = await axios.post(
        loginEndpoint,
        qs.stringify({
          email: user.email,
          password: user.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const token = response.data.token;
      const cookie = `token=${token}; HttpOnly; Path=/;`;

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
              "Content-Type": "application/json",
            },
          },
        );
        console.log(
          `User: ${user.email}, Post: ${j}, Status: ${addPostResponse.status}`,
        );
      }
    }
  } catch (error) {
    console.error(error.response.data);
  } finally {
    console.log("All posts have been added!");
  }
};

const followRequest = async (followingIds) => {
  try {
    const users = require("./users.json");
    const followingIds = require("./followings.json");
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const response = await axios.post(
        loginEndpoint,
        qs.stringify({
          email: user.email,
          password: user.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      const token = response.data.token;
      const cookie = `token=${token}; HttpOnly; Path=/;`;
      const userId = response.data.id;
      console.log("ID BURADA:", userId);

      // Rastgele 30 takip edilecek kullanıcı ID'sini seç
      // Takip edilecek kişi login yapan kişiyle aynı olmasın diye filtrele
      const followingIdsWithoutUserId = followingIds.filter(
        (followingId) => followingId.followingId !== userId,
      );
      const randomFollowingIds = [];
      while (
        randomFollowingIds.length < 30 &&
        followingIdsWithoutUserId.length > 0
      ) {
        const index = Math.floor(
          Math.random() * followingIdsWithoutUserId.length,
        );
        const followingId = followingIdsWithoutUserId.splice(index, 1)[0]
          .followingId;
        randomFollowingIds.push(followingId);
      }

      for (let j = 0; j < randomFollowingIds.length; j++) {
        const followResponse = await axios.post(
          followEndpoint,
          { followingId: randomFollowingIds[j] },
          {
            headers: {
              Cookie: cookie,
              "Content-Type": "application/json",
            },
          },
        );
        console.log("Follow başarılı:", followResponse.data);
      }
    }
  } catch (error) {
    console.error(error.response.data);
  } finally {
    console.log("Follow işlemi bitti.");
  }
};

const main = async () => {
  const users = await generateRandomUsers();
  await findDuplicatedEmails(users);
  const posts = await createPosts();
  const followingIds = await createFollowings();
  await registerUsers(users);
  await followRequest(followingIds);
  await postRequest(posts);
};

main();
