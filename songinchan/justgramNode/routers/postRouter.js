const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/validateToken");

const postControllers = require("../controllers/postControllers");

router.post("/addpost", validateToken, postControllers.addPost);
router.get("/postlist", validateToken, postControllers.postList);
router.post("/userpostlist", validateToken, postControllers.userPostList);
router.patch("/updatepost", validateToken, postControllers.updatePost);
router.delete("/deletepost", validateToken, postControllers.deletePost);

module.exports = router;
