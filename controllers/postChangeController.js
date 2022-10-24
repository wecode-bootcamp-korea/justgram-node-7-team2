const postChangeService = require("../services/postChangeService");

const postChange = async (req, res) => {
  try {
    const { token } = req.headers;
    const { postingId, content } = req.body.data;

    const REQUIRED_KEYS = { postingId, content };
    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`);
        error.statusCode = 400;
        throw error;
      }
    });
    const postChangeInfo = await postChangeService.postChange(
      postingId,
      content,
      token
    );

    res.status(201).json({ data: postChangeInfo });
  } catch (err) {
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = { postChange };
