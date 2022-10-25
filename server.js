const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const start = () => {
  try {
    server.listen(3000, () => {
      console.log("start server http://localhost:3000/");
    });
  } catch (err) {
    console.log(err);
  }
};

start();
