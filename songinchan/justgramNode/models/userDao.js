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
  console.log("userDao - Data Source has been initialized!");
});

const findUserByEmail = async (email) => {
  const existingUser = await myDataSource.query(`
    SELECT id, email, password 
    FROM users 
    WHERE email = '${email}'
    ;`);
  return existingUser;
};

const createUser = async (nickname, email, hashedPW, profile_image) => {
  await myDataSource.query(`
    INSERT INTO users (nickname, email, password, profile_image)
    VALUES 
      ('${nickname}', '${email}', '${hashedPW}', '${profile_image}');
    `);
  const checkSignUp = await myDataSource.query(`
    SELECT * FROM users WHERE nickname='${nickname}';
    `);

  console.log("checkSignUp : ", checkSignUp);
};

const findUserList = async (user_id) => {
  // const userData = await myDataSource.query(`SELECT * FROM users;`);
  const userData = await myDataSource.query(
    `SELECT id, email FROM users WHERE id = ${user_id};`
  );
  console.log("userDao userData =", userData);
  return userData;
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserList,
};
