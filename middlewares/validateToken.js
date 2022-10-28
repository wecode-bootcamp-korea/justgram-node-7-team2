const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const myDataSource = require("../models/index");

const validateToken = async (req, res, next) => {
  try {
    //get token from header
    const { token } = req.headers;

    if (!token) {
      const error = new Error("LOGIN_REQUIRED");
      error.statusCode = 401; //unauthorized
      throw error;
    }

    //if token ==> jwt.verify
    const user = jwt.verify(token, jwtSecret);

    //해당 Userid를 가진 유저가 실제로 존재하는지. 확인

    const [userData] = await myDataSource.query(`
    SELECT id, email FROM users WHERE id = ${user.id}
    `);

    if (!userData) {
      const error = new Error("USER_INVALID");
      error.statusCode = 404;
      throw error;
    }

    req.userInfo = userData;

    next();
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = validateToken;
