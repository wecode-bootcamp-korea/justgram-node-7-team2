const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const router = require("./routers");
const app = express();

const validationRule = require("./validationRule"); // 검증키 모음(진행중)

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());
app.use(router);

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

const server = http.createServer(app);

server.listen(8000, () => {
  console.log("server is listening on PORT 8000");
});
