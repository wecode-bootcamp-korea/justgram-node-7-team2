const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { DataSource, InsertValuesMissingError } = require("typeorm");

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
    try {
        const { email, password, nickname, profileImage } = req.body;
        // 0. 꼭 요구되는 필수값이 빠지지는 않았는지 체크
        const JOIN_REQUIRED_KEYS = [email, password, nickname, profileImage];
        // 1. 예외처리 : email, password 에 (ex. @, .)의 존재여부, 이상한 문자열이 없는지,

        if (!email.includes("@")) {
            // 만약 이메일에 @이 없다면
            throw new Error("EMAIL_INVALID"); // 에러를 던져
        }

        if (!email.includes(".")) {
            // 만약 이메일에 @. 없다면
            throw new Error("EMAIL_INVALD_._MUST_BE_INCLUDED");
        }
        // 1-1. 비밀번호가 10자리를 넘는지 확인, 특수문자 포함하는지. 비밀번호에 본인 유추 가능한 정보가 포함되지는 않았는지 등
        if (password.length < 10) {
            // 비밀번호가 10자리를 넘는지 확인
            throw new Error("EMAIL_INVALID");
        }

        // 1-2(A) . 이미 가입된 이메일, 아이디는 아닌지에 대한 여부. 이미 데이터베이스 상에 존재하는 email로는 가입할 수 없음

        const result = await myDataSource.query(
            `INSERT INTO users
            (nickname, email, password, profile_image)
            VALUES
            ('${nickname}', '${email}', '${password}', '${profileImage}')`
        );

        // 1-2(B) . 이미 가입된 이메일, 아이디는 아닌지에 대한 여부 (A,B 에서 상황에 맞게 가능)

        res.status(200).json({ message: "USER_CREATED" });
    } catch (err) {
        console.log(err);
    }
});

// mission 4 create
app.post("/create", async (req, res) => {
    try {
        const { user_id, contents } = req.body;

        const CREATE_REQUIRED_KEYS = [user_id, contents];

        if (!user_id || !contents) {
            // user_id , contents 값이 없다면 에러
            throw new Error("ESSENTIAL_VALUES_INVALID");
        }

        if (contents.length > 2000) {
            // contents 의 길이가 2000자가 넘는다면 에러
            throw new Error("CONTENTS_LENGTH_INVALID");
        }

        const newPost = await myDataSource.query(
            `INSERT INTO postings
            (user_id, contents)
            VALUES
            ('${user_id}', '${contents}')`
        );

        res.status(200).json({ message: "postCreated" });
    } catch (err) {
        console.log(err);
    }
});

// misson 4 read
app.get("/read", async (req, res) => {
    try {
        const showPost = await myDataSource.query(`SELECT * FROM posting_images`);
        res.status(200).json({ data: showPost });
    } catch (err) {
        console.log(err);
    }
});

// mission 4 update
app.patch("/update", async (req, res) => {
    try {
        const { id, user_id, contents } = req.body;
        const UPDATE_REQUIRED_KEYS = [id, user_id, contents];

        if (!id || !contents || !user_id) {
            throw new Error("ESSENTIAL_VALUES_INVALID");
        }

        const getPost = await myDataSource.query(
            `SELECT
            id,
            user_id,
            contents
            FROM postings
            WHERE id = '${id}' AND user_id = '${user_id}'`
        );
        console.log(getPost);

        const updatePost = await myDataSource.query(
            `UPDATE postings
            SET contents = '${contents}'
            WHERE id = '${id}' AND user_id = '${user_id}'`
        );

        const resultPost = await myDataSource.query(
            `SELECT * FROM postings
            WHERE id = '${id}' AND user_id = '${user_id}'`
        );
        res.status(200).json({ data: resultPost });
    } catch (err) {
        console.log(err);
    }
});

// server
const server = http.createServer(app);
try {
    server.listen(8000, () => {
        console.log({ message: "server is running into port 8000!" });
    });
} catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
}
