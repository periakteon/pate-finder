/**
Follow scripti.
*/

const axios = require("axios");
const qs = require("qs");
const users = require("./users.json");
const followingIds = require("./followings.json");

const loginEndpoint = "http://localhost:3000/api/auth/login";
const followEndpoint = "http://localhost:3000/api/follow/follow";

async function makeRequest() {
  try {
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
        }
      );
      const token = response.data.token;
      const cookie = `token=${token}; HttpOnly; Path=/;`;
      const userId = response.data.id;
      console.log("ID BURADA:", userId);

      // Rastgele 30 takip edilecek kullanıcı ID'sini seç
      // Takip edilecek kişi login yapan kişiyle aynı olmasın diye filtrele
      const followingIdsWithoutUserId = followingIds.filter(
        (followingId) => followingId.followingId !== userId
      );
      const randomFollowingIds = [];
      while (
        randomFollowingIds.length < 30 &&
        followingIdsWithoutUserId.length > 0
      ) {
        const index = Math.floor(
          Math.random() * followingIdsWithoutUserId.length
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
          }
        );
        console.log("Follow başarılı:", followResponse.data);
      }
    }
  } catch (error) {
    console.error(error.response.data);
  }
}

makeRequest();
