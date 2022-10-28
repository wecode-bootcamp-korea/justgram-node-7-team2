const loginUserDao = require("../models/loginUserDao");

const jwt = require("jsonwebtoken"); // 토큰 발급
const jwtSecret = process.env.JWT_SECRET;

const bcrypt = require("bcryptjs"); // 암호화 모듈 리콰이어

const loginUser = async (email, password) => {
  if (!email.includes("@") || !email.includes(".")) {
    // 이메일에 @ or . 이 포함되지 않으면 error를 날린다.
    throw new Error("Email-Invalid"); // throw new Error가 자세히 어떻게 동작이 되는지?
  }
  if (password.length < 10) {
    //비밀번호가 10자리 이상만 가능 아니면 error 날림
    throw new Error("Password-Invalid");
  }

  const userInfo = await loginUserDao.loginUser(email);
  // console.log(userInfo.id);
  if (!userInfo) {
    const error = new Error("userDoesNotExist");
    error.statusCode = 404;
    throw error;
    // 위에 코드와 같은 방식이다!!!!!!!!!!!
    // throw new Error("userDoesNotExist");
  }
  //password isSame using compare method in bcrypt
  const isSame = bcrypt.compareSync(password, userInfo.password);
  if (!isSame) {
    const error = new Error("INVALID_PASSWORD");
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign({ id: userInfo.id }, jwtSecret);
  return token;
};

module.exports = { loginUser };
