const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
// cors 설정들이 적용됩니다.
// 세션때 자세히 다룰 예정입니다.

app.listen(10010);
// console.log(bcrypt);

// const pw = "1234";

// var salt = bcrypt.genSaltSync(14);
// console.log("salt된 값 :", salt);

// const hashedPw = bcrypt.hashSync(pw, salt);

// console.log("hash된값 : ", hashedPw);

// const result = bcrypt.compareSync("1234", hashedPw);

// console.log(`비밀번호 결과:`, result);

// jwt 실습

console.log(jwt);

const token = jwt.sign(
  { userId: 5, iat: Math.floor(Date.now() / 1000) - 30 },
  "seonghee"
);
console.log(token);

const decoded = jwt.verify(token, "seonghee");
console.log(decoded);
