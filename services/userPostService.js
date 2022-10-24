const userPostDao = require("../models/userPostDao");

const userPost = async (id) => {
  const listInfo = await userPostDao.userPost(id);
  return listInfo;
};

module.exports = { userPost };
