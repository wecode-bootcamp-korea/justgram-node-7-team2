const removePostService = require("../services/removePostService");

const removePost = async (req, res) => {
  try {
    const { token } = req.headers;
    const { postingId } = req.body.data;

    const REQUIRED_KEYS = { postingId };

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`);
        error.statusCode = 400; //unauthorized
        throw error;
      }
    });
    await removePostService.removePost(postingId, token);

    res.status(200).json({ message: "postingDeleted" });
  } catch (err) {
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = { removePost };
