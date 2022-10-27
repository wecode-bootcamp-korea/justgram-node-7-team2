const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");

const addPostController = require("../controllers/addPostController");
const postListController = require("../controllers/postListController");
const postChangeController = require("../controllers/postChangeController");
const removePostController = require("../controllers/removePostController");
const userPostController = require("../controllers/userPostController");

router.post("/addpost", validateToken, addPostController.addPost);
router.get("/postlist", validateToken, postListController.postList);
router.patch("/postchange", validateToken, postChangeController.postChange);
router.delete("/removepost", validateToken, removePostController.removePost);
router.get("/userpostinfo", userPostController.userPost);

module.exports = router;
