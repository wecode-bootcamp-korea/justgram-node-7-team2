const http = require("http");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
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

const app = express();
app.use(express.json());

// mission 3
app.post("/join", async (req, res) => {
    const { email, password, nickname, profileImage } = req.body;
    const result = await myDataSource.query(
        `INSERT INTO users
        (nickname, email, password, profile_image)
        VALUES
        ('${nickname}', '${email}', '${password}', '${profileImage}')`
    );
    res.status(200).json({ message: "USER_CREATED" });
});

// mission 4 create
app.post("/posting", async (req, res) => {
    const { user_id, contents } = req.body;
    const newPost = await myDataSource.query(
        `INSERT INTO postings
        (user_id, contents)
        VALUES
        ('${user_id}', '${contents}')`
    );
    res.status(200).json({ message: "postCreated" });
});

// server
const server = http.createServer(app);
try {
    server.listen(8000, () => {
        console.log({ message: "server is running into port 8000!" });
    });
} catch (err) {
    console.log(err);
}
