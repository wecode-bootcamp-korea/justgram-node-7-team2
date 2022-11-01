const express = require("express");
const router = express.Router();

const postRouter = require("./postRouter");
const userRouter = require("./userRouter");

router.use("/ping", (req, res) => {
  console.log("pong");
  return res.json({ message: "/pong" });
});

router.use("/users", userRouter);
router.use("/post", postRouter);

module.exports = router;
