const axios = require('axios');

axios.delete('http://localhost:3000/api/deleteAllUsers')
  .then(response => {
    console.log(response.data.message);
  })
  .catch(error => {
    console.error(error.response.data.message);
  });
