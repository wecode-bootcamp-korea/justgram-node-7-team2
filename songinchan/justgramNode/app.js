const express = require("express");
const router = require("./routers");
const morgan = require("morgan");
const cors = require("cors");

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(router);
  app.use(morgan("combined"));
  app.use(cors(corsOptions));

  return app;
};

module.exports = createApp;
