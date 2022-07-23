const User = require('../models/user');

const generateUser = () => {
  const user = new User({
    username: "John Doe",
    password: "password",
    tweets: [],
    comments: []
  }).save()
};

const generatePost = () => {};
const generateReply = () => {};
