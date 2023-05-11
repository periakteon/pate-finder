/**
 * Login yapıp post ve takip ekleme scripti.
 *
 */

const axios = require("axios");
const qs = require("qs");
const users = require("./users.json");
const posts = require("./posts.json");
const followingIds = require("./followings.json");

const loginEndpoint = "http://localhost:3000/api/auth/login";
const addPostEndpoint = "http://localhost:3000/api/post/handlerPost";
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
          }
        );
        console.log(
          `User: ${user.email}, Post: ${j}, Status: ${addPostResponse.status}`
        );
      }
    }
  } catch (error) {
    console.error(error.response.data);
  }
}

makeRequest();
