const jwt = require("jsonwebtoken");
const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("validateToken_Data Source has been initialized!");
});

const validateToken = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      const error = new Error("TOKEN_REQUIRE");
      error.statusCode = 401;
      throw error;
    }

    const user = jwt.verify(token, process.env.SECRET_KEY); // token으로 사용자ID 검증
    const userID = user.id;

    const userData = await myDataSource.query(`
    SELECT id, email FROM users WHERE id = '${userID}' 
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

module.exports = { validateToken };
