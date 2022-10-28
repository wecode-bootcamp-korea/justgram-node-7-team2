const userPostService = require("../services/userPostService");

const userPost = async (req, res) => {
  try {
    const { id } = req.body.data;
    const listInfo = await userPostService.userPost(id);
    res.status(201).json({ data: listInfo });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { userPost };
