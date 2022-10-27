const userService = require("../services/userService");

const signUp = async (req, res) => {
  try {
    const { nickname, email, password, profile_image } = req.body;

    // Error Handling
    const REQUIRE_KEYS = { nickname, email, password, profile_image };
    Object.keys(REQUIRE_KEYS).map((key) => {
      if (!REQUIRE_KEYS[key]) {
        const error = new Error(`KEY_ERROR ${key}`);
        error.statusCode = 400;
        throw error;
        // throw new Error(`KEY_ERROR ${key}`); // 한줄로 쓸때
      }
    });

    const result = await userService.signUp(
      email,
      password,
      nickname,
      profile_image
    );

    console.log(result);
    res.status(201).json({ message: "userCreated" });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const REQUIRE_KEYS = { email, password };
    Object.keys(REQUIRE_KEYS).map((key) => {
      if (!REQUIRE_KEYS[key]) {
        const error = new Error(`KEY_ERROR ${key}`);
        error.statusCode = 400;
        throw error;
      }
    });

    const token = await userService.signIn(email, password);

    res.status(200).json({ message: "userLogIn_Success", token });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

const userList = async (req, res) => {
  try {
    const data = await userService.userList();
    console.log("Controllers result : ", data);

    res.status(200).json({ userData: data });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  signUp,
  signIn,
  userList,
};
