const addPostDao = require("../models/addPostDao");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const addPost = async (title, content, image_url, token) => {
  if (!token) {
    const error = new Error("YOU NEED LOGIN");
    error.statusCode = 401; //unauthorized
    throw error;
  }
  //if token ==> jwt.verify
  const user = jwt.verify(token, jwtSecret);
  const user_id = user.id;

  await addPostDao.addPost(title, content, user_id, image_url);
};

module.exports = { addPost };
