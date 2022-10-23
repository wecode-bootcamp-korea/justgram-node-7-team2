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

// --------------------------------------------------------------------------
// server 테스트 url
app.get("/ping", (req, res, next) => {
  res.json({ message: "/pong" });
});

// --------------------------------------------------------------------------
// userList 가져오기
const userList = async (req, res) => {
  try {
    const userData = await myDataSource.query(`SELECT * FROM users;`);

    console.log("result : ", userData);

    res.status(200).json({ users: userData });
  } catch {
    console.log(err);
  }
};

// --------------------------------------------------------------------------
// userCreated 회원 가입
const userSignUp = async (req, res) => {
  try {
    const { nickname, email, password, profile_image } = req.body;

    // Error Handling
    const REQUIRE_KEYS = { email, password, nickname };
    Object.keys(REQUIRE_KEYS).map((key) => {
      if (!REQUIRE_KEYS[key]) {
        const error = new Error(`KEY_ERROR ${key}`);
        error.statusCode = 400;
        throw error;

        // throw new Error(`KEY_ERROR ${key}`); // 한줄로 쓸때
      }
    });

    if (!email.includes("@") || !email.includes(".")) {
      const error = new Error("EMAIL_INVALID");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 4) {
      const error = new Error("PASSWORD_INVALID");
      error.statusCode = 400;
      throw error;
    }

    // PW에 전화번호 포함시 가입불가
    // const [_, firstNumber, lastNumber] = phone_number.split("-");
    // if (password.includes(firstNumber) || password.includes(lastNumber)) {
    //     throw new Error("PASSWORD_INCLUDING_PHONE_NUMBER!");
    // }

    const [existingUser] = await myDataSource.query(`
      SELECT id, email, password 
      FROM users 
      WHERE email = '${email}'
      ;`);

    if (existingUser) {
      const error = new Error("EXISTING_USER");
      error.statusCode = 404;
      console.log("existingUser info : ", existingUser);
      throw error;
    }

    // Bcrypt 암호화
    const salt = bcrypt.genSaltSync();
    const hashedPW = bcrypt.hashSync(password, salt);
    console.log("hashedPW :", hashedPW);

    await myDataSource.query(`
    INSERT INTO users (nickname, email, password, profile_image)
    VALUES 
      ('${nickname}', '${email}', '${hashedPW}', '${profile_image}');
    `);

    const checkSignUp = await myDataSource.query(`
    select * from users where nickname='${nickname}';
    `);

    console.log(checkSignUp);
    res.status(201).json({ message: "userCreated" });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// --------------------------------------------------------------------------
//  /signIn 유저 로그인
const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Error Handling
    const REQUIRE_KEYS = { email, password };
    Object.keys(REQUIRE_KEYS).map((key) => {
      if (!REQUIRE_KEYS[key]) {
        const error = new Error(`KEY_ERROR ${key}`);
        error.statusCode = 400;
        throw error;
      }
    });

    if (!email.includes("@") || !email.includes(".")) {
      const error = new Error("EMAIL)INVALID");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 4) {
      const error = new Error("PASSWORD_INVALID");
      error.statusCode = 400;
      throw error;
    }

    const [existingUser] = await myDataSource.query(`
      SELECT id, email, password 
      FROM users 
      WHERE email = '${email}'
      ;`);

    if (!existingUser) {
      const error = new Error("NOT_EXISTING_USER");
      error.statusCode = 404;
      throw error;
    }
    // Bcrypt 암호화 PASSWORD 검증
    const checkPW = bcrypt.compareSync(password, existingUser.password);
    if (!checkPW) {
      const error = new Error("WRONG_PASSWORD");
      error.statusCode = 404;
      throw error;
    }

    // token 발행
    const token = jwt.sign({ id: existingUser.id }, process.env.SECRET_KEY);

    console.log([existingUser, token]);
    res.status(200).json({ message: "userLogIn_Success", token: token });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// --------------------------------------------------------------------------
//  /posting, addPost 포스트 게시하기
const addPost = async (req, res) => {
  try {
    const { contents, image_url } = req.body;
    const { id } = req.userInfo[0];

    // error Handelig
    const REQUIRE_KEYS = { contents };
    Object.keys(REQUIRE_KEYS).map((key) => {
      if (!REQUIRE_KEYS[key]) {
        const error = new Error(`KEY_ERROR ${key}`);
        error.statusCode = 400;
        throw error;
      }
    });

    if (!contents) {
      const error = new Error("CONTENTS_EMPTY");
      error.statusCode = 400;
      throw error;
    }

    console.log(`userId is :${id}`);

    // let postingPk;
    await myDataSource.query(
      `
      INSERT INTO postings (user_id, contents)
      VALUES ('${id}', '${contents}');      
      `

      // ------- <MEMO> -------
      // 사용자가 포스팅을 할 땐, 사용자(user_id),
      // contents, 그리고 사진(posting_img)도 올릴텐데,
      // 사진은 테이블이 다르다. 그럼 올리는 시점에서 생성되는 posting PK id가 필요하다.
      // 이거 대체 어떻게 가져오나!!!

      // 구글링해서 어찌어찌 찾았는데 어떻게 적용하는건가?

      // , function (error, results, fields) {
      //   if (error) throw error;
      //   postingPk = results;
      //   return postingPk;
      // }
    );
    // console.log(postingPk);

    // await myDataSource.query(
    //   `
    //     INSERT INTO posting_images (posting_id, image_url)
    //     VALUES (
    //       '${postingPk}', '${image_url}';
    //   `
    // );

    const checkAddPost = await myDataSource.query(`
      SELECT p.id, p.user_id, p.contents, pi2.image_url
      FROM postings p
      JOIN posting_images pi2
        on p.id = pi2.posting_id
      WHERE p.user_id = '${id}'
      ;`);
    console.log(checkAddPost);
    res.status(201).json({ message: "postCreated" });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// --------------------------------------------------------------------------
// 게시글 전체 리스트 불러오기
// Read 1
async function postList(req, res) {
  try {
    const data = await myDataSource.query(`   
    SELECT
      u.id userId,
      u.profile_image userProfileImage,
      p.id postingId,
      pi2.image_url postingImageUrl,
      p.contents postingContent
    from postings p 
    left join users u 
      on p.user_id = u.id
    left JOIN posting_images pi2 
      on p.id = pi2.posting_id 
    ;`);

    console.log(data);

    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
}

// --------------------------------------------------------------------------
// 1명의 게시글 리스트 불러오기
// Read 2
async function userPostList(req, res) {
  try {
    const { id } = req.body;

    const data = await myDataSource.query(`
    SELECT id userId, profile_image userProfileImage
    FROM users u
    WHERE u.id = '${id}'
    ;
    `);

    const posting = await myDataSource.query(`
    SELECT p.id postingId, pi2.image_url postingImageUrl, p.contents postingContent
    FROM postings p
    inner join users u
      on p.user_id = u.id
    left join posting_images pi2
      on p.id = pi2.posting_id
    WHERE u.id = '${id}';
    `);

    data.posting = posting;

    console.log(data);
    res.status(201).json({ data }); // 도저히 못풀겠다!! ㅠ
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
}

// --------------------------------------------------------------------------
// 게시물 update, 수정
async function updatePost(req, res) {
  try {
    const { user_id, id, contents } = req.body;

    const data = await myDataSource.query(`
    SELECT 
      u.id userId,
      u.nickname userName,
      p.id postingId,
      p.contents postingContent
    FROM postings p 
      inner join users u 
      on p.user_id = u.id 
    WHERE u.id = '${user_id}' && p.id = '${id}'
  `);

    const update = await myDataSource.query(`
    UPDATE postings SET contents = '${contents}'
    WHERE id = '${id}';
    `);

    console.log(check);
    res.status(201).json({ data: data });
  } catch (err) {
    console.log(err);
  }
}

// --------------------------------------------------------------------------
// 게시물 Delete, 삭제
async function deletePost(req, res) {
  try {
    const { id } = req.body;

    const data = await myDataSource.query(`
    SELECT 
      p.id postingId,
      p.contents postingContent
    FROM postings p 
    WHERE p.id = '${id}'
  `);

    const update = await myDataSource.query(`
    DELETE FROM postings
    WHERE id = '${id}';
    `);

    const check = await myDataSource.query(`
    SELECT
      u.id userId,
      u.profile_image userProfileImage,
      p.id postingId,
      pi2.image_url postingImageUrl,
      p.contents postingContent
    from postings p 
      left join users u 
      on p.user_id = u.id
      left JOIN posting_images pi2 
      on p.id = pi2.posting_id 
  ;`);

    console.log(check);
    res.status(200).json({ data: check });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
}

// --------------------------------------------------------------------------
// url / http 메소드 정리
app.get("/users", validateToken, userList);
app.post("/signup", userSignUp);
app.post("/post", validateToken, addPost);
app.get("/post", validateToken, postList);
app.post("/post/user", validateToken, userPostList);
app.patch("/post", validateToken, updatePost);
app.delete("/post", validateToken, deletePost);
app.post("/signin", userSignIn);

const server = http.createServer(app);

server.listen(8000, () => {
  console.log("server is listening on PORT 8000");
});
