const express = require("express");
const router = require("./routers");
const morgan = require("morgan");
const cors = require("cors");

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(router);
  app.use(morgan("combined"));
  app.use(cors());

  return app;
};

module.exports = createApp;
