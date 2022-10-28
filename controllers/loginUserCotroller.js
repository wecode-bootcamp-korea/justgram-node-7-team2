const loginUserService = require("../services/loginUserService");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    //1. key error check
    //2. email, password validation
    //3. user existence check
    //4. password isSame
    const REQUIRED_KEYS = {
      email,
      password,
    };
    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });
    const token = await loginUserService.loginUser(email, password);
    res.status(200).json({ message: "loginSuccess", token: token });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = { loginUser };
