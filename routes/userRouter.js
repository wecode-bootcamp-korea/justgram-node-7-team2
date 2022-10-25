const express = require("express");
const router = express.Router();
const createUserController = require("../controllers/createUserController");
const loginUserController = require("../controllers/loginUserCotroller");

router.post("/signup", createUserController.createUser);
router.post("/login", loginUserController.loginUser);

module.exports = router;
