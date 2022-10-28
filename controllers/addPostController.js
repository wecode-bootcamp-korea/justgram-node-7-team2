const addPostService = require("../services/addPostService");

const addPost = async (req, res) => {
  try {
    const { token } = req.headers;
    const { title, content, image_url } = req.body.data; //receive data from client : title content
    const REQUIRED_KEYS = { title, content, image_url };
    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`YOU NEED ${key} VALUE`);
        error.statusCode = 400;
        throw error;
      }
    });

    await addPostService.addPost(title, content, image_url, token);

    res.status(200).json({ message: "postCreated" });
  } catch (err) {
    console.log(err); //터미널에서 확인하는 용도
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      res.status(400).json({ message: "YOU NEED SIGN UP" });
    }
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = { addPost };
