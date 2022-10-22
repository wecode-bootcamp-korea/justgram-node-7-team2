const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

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
  console.log("Data Source has been initialized!");
});

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

module.exports = { validateToken };
