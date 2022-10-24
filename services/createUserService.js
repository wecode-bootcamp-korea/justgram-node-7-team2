const createUserDao = require("../models/createUserDao");

const bcrypt = require("bcryptjs"); // 암호화 모듈 리콰이어

const createUser = async (
  email,
  nickname,
  password,
  profile_image,
  phoneNumber
) => {
  console.log("i am service 1");
  if (!email.includes("@") || !email.includes(".")) {
    // 이메일에 @ or . 이 포함되지 않으면 error를 날린다.
    throw new Error("Email-Invalid"); // throw new Error가 자세히 어떻게 동작이 되는지?
  }

  if (password.length < 10) {
    //비밀번호가 10자리 이상만 가능 아니면 error 날림
    throw new Error("Password-Invalid");
  }

  const [_, frontNum, backNum] = phoneNumber.split("-");
  if (password.includes(frontNum || backNum)) {
    // 핸드폰 번호가 비밀번호에 포함되어있을때 error 발생
    throw new Error("Phone number is included in the password");
  }

  const salt = bcrypt.genSaltSync();

  const hashedPw = bcrypt.hashSync(password, salt);

  const createUser = await createUserDao.createUser(
    email,
    nickname,
    hashedPw,
    profile_image
  );
  console.log("i am service 2");
  return createUser;
};

module.exports = {
  createUser,
};
