const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validationRule = require("../middlewares/validationRule"); // 검증키 모음(진행중)

const userDao = require("../models/userDao");

const signUp = async (email, password, nickname, profile_image) => {
  // if (!email.includes("@") || !email.includes(".")) {
  //   const error = new Error("EMAIL_INVALID");
  //   error.statusCode = 400;
  //   throw error;
  // }
  // 아래 validationRule.EMAIL_VALIDATION.test(email) 정규식으로 대체

  if (!validationRule.EMAIL_VALIDATION.test(email)) {
    const error = new Error(
      "EMAIL_INVALID_VALIDATION_RULES / 이메일 형식과 맞지 않습니다. 정신 차리고 다시 넣어주세요!! "
    );
    error.statusCode = 400;
    throw error;
  }

  // if (password.length < 4) {
  //   const error = new Error("PASSWORD_INVALID");
  //   error.statusCode = 400;
  //   throw error;
  // }
  // 아래 validationRule.PASSWORD_VALIDATION.test 정규식으로 대체

  if (!validationRule.PASSWORD_VALIDATION.test(password)) {
    const error = new Error(
      "PASSWORD_INVALID / 패스워드는 대문자+소문자+숫자 조합이어야만 합니다. / 8자 이상만 받습니다. / 특수기호는 안받습니다 ^^;;"
    );
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
  // if (!email.includes("@") || !email.includes(".")) {
  //   const error = new Error("EMAIL_INVALID");
  //   error.statusCode = 400;
  //   throw error;
  // }

  if (!validationRule.EMAIL_VALIDATION.test(email)) {
    const error = new Error(
      "EMAIL_INVALID_VALIDATION_RULES / 이메일 형식과 맞지 않습니다. 정신 차리고 다시 넣어주세요!! "
    );
    error.statusCode = 400;
    throw error;
  }

  // if (password.length < 4) {
  //   const error = new Error("PASSWORD_INVALID");
  //   error.statusCode = 400;
  //   throw error;
  // }

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
  return token;
};

const userList = async () => {
  const result = await userDao.findUserList();
  console.log("service userList =", result);
  return result;
};

const getMe = async (user_id) => {
  const result = await userDao.getMe(user_id);
  // console.log("service userList =", result);
  return result;
};

module.exports = {
  signUp,
  signIn,
  userList,
  getMe,
};
