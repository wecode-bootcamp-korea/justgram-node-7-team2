const http = require("http");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config(); // config를 이용해서 실행
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
    console.log("Data Source has been initialized!"); // 데이터 연결 잘됐음을 콘솔에 출력
});

const app = express();
app.use(express.json());

// =============================================================

// mission 3 회원가입

app.post("/join", async (req, res) => {
    try {
        const { email, password, nickname, profileImage, phone_number } = req.body;

        // 0. 꼭 요구되는 필수값이 빠지지는 않았는지 체크
        const REQUIRED_KEYS = { email, password, nickname, profileImage, phone_number };

        REQUIRED_KEYS.map((key) => {
            if (!key) {
                throw new Error("KEY_ERROR");
            }
        });

        // 1. 예외처리 : email, password 에 (ex. @ || .)의 존재여부, 이상한 문자열이 없는지.
        // 만약 이메일에 @이 없다면
        if (!email.includes("@")) {
            const error = new Error("EMAIL_INVALID"); // 에러를 던져
            error.statusCode = 400;
            throw error;
        }
        // 만약 이메일에 . 이 없다면 에러를 던져
        if (!email.includes(".")) {
            throw new Error("EMAIL_INVALD_._MUST_BE_INCLUDED");
        }
        // 2. 예외처리 : 비밀번호가 10자리를 넘는지 확인, 특수문자 포함하는지. 비밀번호에 본인 유추 가능한 정보가 포함되지는 않았는지 등
        // 비밀번호가 10자리를 넘는지 확인
        if (password.length < 10) {
            throw new Error("PASSWORD_LENGTH_INVALID");
        }
        // 폰번호가 비밀번호에 포함되어있지는 않은지
        const [_, firstNumber, lastNumber] = phone_number.split("-");
        if (password.includes(firstNumber)) {
            throw new Error("PASSWORD_INCLUDING_PHONE_NUMBER!");
        }

        if (password.includes(lastNumber)) {
            throw new Error("PASSWORD_INCLUDING_PHONE_NUMBER!");
        }
        // 3. 예외처리 : 이미 가입된 이메일, 아이디는 아닌지에 대한 여부. 이미 데이터베이스 상에 존재하는 email로는 가입할 수 없음
        // 3-1) select 로 기존 존재하는 유저를 가져와서 있으면 중복 -> 가입불가, 없으면 가입 가능
        await myDataSource.query(`SELECT id, email FROM users WHERE email = '${email}'`);
        // 3-2) email UNIQUE -> db가 자동으로 중복 이메일 걸러줌 (email 에 유니크 걸기)
        // 인서트로 정보를 넣어보고 빠꾸먹으면 시도했다는 흔적이 남아서 시도한 횟수만큼 id 값이 비어있음
        await myDataSource.query(
            `INSERT INTO users (name, email, password, profile_image)
            VALUES
            ('${nickname}', '${email}', '${password}', '${profileImage}')`
        );
        // ********* bcrypt 암호화. (위치 = 디비에 인서트 하기 전에 함) ************
        // console.log("before :", password);
        const hashedPw = bcrypt.hashSync(password, bcrypt.genSaltSync());
        // console.log("after :", hashedPw);

        await myDataSource.query(
            `INSERT INTO users
            (nickname, email, password, profile_image, phone_number)
            VALUES
            ('${nickname}', '${email}', '${hashedPw}', '${profileImage}', '${phone_number}')` // password 해싱 후
            // ('${nickname}', '${email}', '${password}', '${profileImage}')`  password 해싱 전
        );

        // const makeHash = async (password) => {
        //     return await bcrypt.hash(password, 10);
        // };
        // const main = async () => {
        //     const hasedPassword = await makeHash("mySimplePassword");
        //     console.log("hashedPassword: ", hasedPassword);
        // };
        // main();

        res.status(200).json({ message: "USER_CREATED" });
    } catch (err) {
        console.log(err);
    }
});

// 로그인
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. key_error
        const REQUIRED_KEYS = { email, password };
        Object.keys(REQUIRED_KEYS).map((key) => {
            if (!REQUIRED_KEYS[key]) {
                throw new Error(`KEY_ERROR: ${key}`);
            }
        });
        // 2. email, password validation <- front 에서 이미 한번 걸러서 옴 (우리는 더블체크)
        // 3. user existence 유저의 존재 유무 체크
        const [existingUser] = await myDataSource.query(`SELECT id, email, password FROM users WHERE email = '${email}'`);

        console.log("USER: ", existingUser);
        if (existingUser === undefined) {
            const error = new Error("USER_DOES_NOT_EXIST");
            error.statusCode = 404;
            throw error;
        }

        // 4. password isSame using compare method is bcrypt 비번이 일치하는지
        const isSame = bcrypt.compareSync(password, existingUser.password);

        console.log("isSamePassword:", isSame);

        if (isSame === false) {
            const error = new Error("INVALID_PASSWORD");
            error.statusCode = 400;
            throw error;
        }

        //5. success -> token
    } catch (err) {
        console.log(eff);
    }
});

// mission 4 게시글 생성
app.post("/create", async (req, res) => {
    try {
        const { user_id, contents } = req.body;

        const REQUIRED_KEYS = { user_id, contents };
        Object.keys(REQUIRED_KEYS).map((key) => {
            if (!REQUIRED_KEYS[key]) {
                throw new Error(`KEY_ERROR: ${key}`);
            }
        });

        if (!user_id || !contents) {
            // user_id , contents 값이 없다면 에러
            throw new Error("ESSENTIAL_VALUES_INVALID");
        }

        if (contents.length > 2000) {
            // contents 의 길이가 2000자가 넘는다면 에러
            throw new Error("CONTENTS_LENGTH_INVALID");
        }
        // postings 테이블 안에 user_id, conents 를 담은 새로운 데이터 추가
        await myDataSource.query(
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

// misson 4 게시글 보여주기
app.get("/read", async (req, res) => {
    try {
        const showPost = await myDataSource.query(`SELECT * FROM posting_images`);
        res.status(200).json({ data: showPost });
    } catch (err) {
        console.log(err);
    }
});

// mission 4 수정
app.patch("/update", async (req, res) => {
    try {
        const { id, user_id, contents } = req.body;

        const REQUIRED_KEYS = { id, user_id, contents };
        Object.keys(REQUIRED_KEYS).map((key) => {
            if (!REQUIRED_KEYS[key]) {
                throw new Error(`KEY_ERROR: ${key}`);
            }
        });

        if (!id || !contents || !user_id) {
            throw new Error("ESSENTIAL_VALUES_INVALID");
        }
        // post 내용들 가져오기
        await myDataSource.query(
            `SELECT
            id,
            user_id,
            contents
            FROM postings
            WHERE id = '${id}' AND user_id = '${user_id}'`
        );
        console.log(getPost);

        // 게시글 내용 수정하기
        await myDataSource.query(
            `UPDATE postings
            SET contents = '${contents}'
            WHERE id = '${id}' AND user_id = '${user_id}'`
        );

        // 수정된 게시글 내용 가져오기
        await myDataSource.query(
            `SELECT * FROM postings
            WHERE id = '${id}' AND user_id = '${user_id}'`
        );
        res.status(200).json({ data: resultPost });
    } catch (err) {
        console.log(err);
    }
});

// mission 4 삭제
app.delete("/delete", async (req, res) => {
    try {
        const { id, user_id } = req.body;
        await myDataSource.query(
            `DELETE FROM postings
            WHERE id = '${id}' 
            AND user_id = '${user_id}'`
        );
        res.status(200).json({ message: "postingDeleted" });
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
