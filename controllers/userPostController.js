const userPostService = require("../services/userPostService");

const userPost = async (req, res) => {
  try {
    const id = req.body.data;
    const listInfo = await userPostService.userPost(id);
    // console.log(listInfo);
    res.status(201).json({ data: listInfo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { userPost };
