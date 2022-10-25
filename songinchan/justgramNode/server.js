const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql"); // 이거 내가 왜 넣었지??
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validationRule = require("./validationRule"); // 검증키 모음
const { validateToken } = require("./middlewares/validateToken");

const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

// Layered Pattern Module
const userControllers = require("./controllers/userControllers");
const postControllers = require("./controllers/postControllers");

// --------------------------------------------------------------------------
// server 테스트 url
app.get("/ping", (req, res, next) => {
  res.json({ message: "/pong" });
});

// --------------------------------------------------------------------------
// url / http 메소드 정리
app.get("/users", validateToken, userControllers.userList);
app.post("/signup", userControllers.signUp);
app.post("/post", validateToken, postControllers.addPost);
app.get("/post", validateToken, postControllers.postList);
app.post("/post/user", validateToken, postControllers.userPostList);
app.patch("/post", validateToken, postControllers.updatePost);
app.delete("/post", validateToken, postControllers.deletePost);
app.post("/signin", userControllers.signIn);

const server = http.createServer(app);

server.listen(8000, () => {
  console.log("server is listening on PORT 8000");
});
