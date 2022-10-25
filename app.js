const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { validateToken } = require("./middlewares/validateToken");

const createUserController = require("./controllers/createUserController");
const loginUserController = require("./controllers/loginUserCotroller");
const addPostController = require("./controllers/addPostController");
const postListController = require("./controllers/postListController");
const postChangeController = require("./controllers/postChangeController");
const removePostController = require("./controllers/removePostController");
const userPostController = require("./controllers/userPostController");

const app = express();
app.use(express.json()); //req.body undefined 에러 해결(아마 express사용시 발생하는 에러인듯? 전에는 body-parser Install해서 해결한 기억이 있는데 그게 express 업데이트 되면서 express내장 기능으로 추가 된듯)
// app.use(express.urlencoded({ extended: false }));
//유저가 작성한 해당 게시물 삭제 함수 CRUD중 DELETE 부분

app.get("/", (req, res) => {
  res.json({ message: "success" });
});

app.post("/signup", createUserController.createUser);
app.post("/login", loginUserController.loginUser);
app.post("/addpost", validateToken, addPostController.addPost);
app.get("/postlist", validateToken, postListController.postList);
app.patch("/postchange", validateToken, postChangeController.postChange);
app.delete("/removepost", validateToken, removePostController.removePost);
app.get("/userpostinfo", validateToken, userPostController.userPost);

// console.log(app);
module.exports = { app: app };
