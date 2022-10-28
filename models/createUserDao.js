const myDataSource = require("./index");

const createUser = async (email, nickname, hashedPw, profile_image) => {
  await myDataSource.query(
    `INSERT INTO users ( email, nickname, password, profile_image)
    VALUES (
      "${email}", "${nickname}", "${hashedPw}", "${profile_image}"
      )`
  );
};

module.exports = {
  createUser,
};
