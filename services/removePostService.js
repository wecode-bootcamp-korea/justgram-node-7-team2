const removePostDao = require("../models/removePostDao");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const removePost = async (postingId, token) => {
  const user = jwt.verify(token, jwtSecret);
  const user_id = user.id;

  await removePostDao.removePost(postingId, user_id);
};

module.exports = { removePost };
