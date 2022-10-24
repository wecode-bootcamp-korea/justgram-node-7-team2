const postListService = require("../services/postListService");

const postList = async (req, res) => {
  try {
    const listInfo = await postListService.postList();
    res.status(201).json({ data: listInfo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { postList };
