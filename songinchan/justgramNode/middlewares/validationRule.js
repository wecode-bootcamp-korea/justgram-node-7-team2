const EMAIL_VALIDATION = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
// 알파벳+@+알파벳+"."+2~4글자의 도메인이 아니면 아웃!
const PASSWORD_VALIDATION =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
// 대문자+소문자+숫자 반드시 조합, 8글자 이상

// const PHONE_NUMBER_VALIDATION =

module.exports = {
  EMAIL_VALIDATION,
  PASSWORD_VALIDATION,
};
