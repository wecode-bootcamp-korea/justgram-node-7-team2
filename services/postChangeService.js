const postChangeDao = require("../models/postChangeDao");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const postChange = async (postingId, content, token) => {
  const user = jwt.verify(token, jwtSecret);
  const user_id = user.id;

  const postChangeInfo = await postChangeDao.postChange(
    postingId,
    content,
    user_id
  );
  return postChangeInfo;
};

module.exports = { postChange };
