const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postDao = require("../models/postDao");

const addPost = async (contents, id) => {
  if (!contents) {
    const error = new Error("CONTENTS_EMPTY");
    error.statusCode = 400;
    throw error;
  }

  console.log("service contents : ", contents);
  const result = await postDao.createPost(contents, id);
  return result;
};

const postList = async () => {
  const result = await postDao.postList();
  return result;
};

const userPostList = async (id) => {
  const result = await postDao.userPostList(id);
  return result;
};

const updatePost = async (user_id, id, contents) => {
  const result = await postDao.updatePost(user_id, id, contents);
  return result;
};

const deletePost = async (id) => {
  const result = await postDao.deletePost(id);
  return result;
};

const readPost = async (id) => {
  const result = await postDao.readPost(id);
  return result;
};

module.exports = {
  addPost,
  postList,
  userPostList,
  updatePost,
  deletePost,
  readPost,
};
