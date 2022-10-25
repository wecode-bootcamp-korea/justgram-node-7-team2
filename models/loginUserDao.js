const myDataSource = require("./index");

const loginUser = async (email) => {
  const [userInfo] = await myDataSource.query(`
    SELECT * FROM users 
    WHERE email ="${email}"`);

  return userInfo;
};

module.exports = { loginUser };
