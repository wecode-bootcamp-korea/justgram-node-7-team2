const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userDao = require("../models/userDao");

const signUp = async (email, password, nickname, profile_image) => {
  if (!email.includes("@") || !email.includes(".")) {
    const error = new Error("EMAIL_INVALID");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 4) {
    const error = new Error("PASSWORD_INVALID");
    error.statusCode = 400;
    throw error;
  }

  // PW에 전화번호 포함시 가입불가
  // const [_, firstNumber, lastNumber] = phone_number.split("-");
  // if (password.includes(firstNumber) || password.includes(lastNumber)) {
  //     throw new Error("PASSWORD_INCLUDING_PHONE_NUMBER!");
  // }
  const existingUser = await userDao.findUserByEmail(email);

  console.log("existingUser :", existingUser);

  if (existingUser.length !== 0) {
    const error = new Error("EXISTING_USER");
    error.statusCode = 404;
    console.log("existingUser info : ", existingUser);
    throw error;
  }

  // Bcrypt 암호화
  const salt = bcrypt.genSaltSync();
  const hashedPW = bcrypt.hashSync(password, salt);
  console.log("hashedPW :", hashedPW);

  return await userDao.createUser(nickname, email, hashedPW, profile_image);
};

const signIn = async (email, password) => {
  if (!email.includes("@") || !email.includes(".")) {
    const error = new Error("EMAIL)INVALID");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 4) {
    const error = new Error("PASSWORD_INVALID");
    error.statusCode = 400;
    throw error;
  }

  const [existingUser] = await userDao.findUserByEmail(email);

  if (!existingUser) {
    const error = new Error("NOT_EXISTING_USER");
    error.statusCode = 404;
    throw error;
  }
  // Bcrypt 암호화 PASSWORD 검증
  const checkPW = bcrypt.compareSync(password, existingUser.password);

  if (!checkPW) {
    const error = new Error("WRONG_PASSWORD");
    error.statusCode = 404;
    throw error;
  }

  // token 발행
  const token = jwt.sign({ id: existingUser.id }, process.env.SECRET_KEY);

  console.log("existingUser = ", existingUser, "token = ", token);
};

const userList = async () => {
  const result = await userDao.findUserList();
  console.log("service userList =", result);
  return result;
};

module.exports = {
  signUp,
  signIn,
  userList,
};
