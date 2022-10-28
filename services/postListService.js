const postListDao = require("../models/postListDao");

const postList = async () => {
  const listInfo = await postListDao.postList();
  return listInfo;
};

module.exports = { postList };
