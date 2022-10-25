const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/validateToken");

const userControllers = require("../controllers/userControllers");

router.get("/userlist", validateToken, userControllers.userList);
router.post("/signup", userControllers.signUp);
router.post("/signin", userControllers.signIn);

module.exports = router;
