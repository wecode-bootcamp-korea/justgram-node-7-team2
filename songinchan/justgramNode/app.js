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
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(router);
  app.use(morgan("combined"));

  return app;
};

module.exports = createApp;
