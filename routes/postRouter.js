const express = require("express");
const router = express.Router();

const addPostController = require("../controllers/addPostController");
const postListController = require("../controllers/postListController");
const postChangeController = require("../controllers/postChangeController");
const removePostController = require("../controllers/removePostController");
const userPostController = require("../controllers/userPostController");

router.post("/addpost", addPostController.addPost);
router.get("/postlist", postListController.postList);
router.patch("/postchange", postChangeController.postChange);
router.delete("/removepost", removePostController.removePost);
router.get("/userpostinfo", userPostController.userPost);

module.exports = router;
