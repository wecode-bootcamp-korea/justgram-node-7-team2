const createUserService = require("../services/createUserService");

const createUser = async (req, res) => {
  try {
    console.log("i am controller 1");
    const { email, nickname, password, profile_image, phoneNumber } =
      req.body.data;

    const REQUIRED_KEYS = {
      email,
      nickname,
      password,
      profile_image,
      phoneNumber,
    };

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });
    console.log("i am controller 2");
    console.log(createUserService);
    const result = await createUserService.createUser(
      email,
      nickname,
      password,
      profile_image,
      phoneNumber
    );
    console.log("i am controller 3");
    res.status(200).json({ message: "userCreated" });
  } catch (err) {
    console.log(err);
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Can't sign up already exists email" });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = {
  createUser,
};
