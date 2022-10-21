const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcryptjs"); // 암호화 모듈 리콰이어
const jwt = require("jsonwebtoken"); // 토큰 발급

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
app.use(express.json()); //req.body undefined 에러 해결(아마 express사용시 발생하는 에러인듯? 전에는 body-parser Install해서 해결한 기억이 있는데 그게 express 업데이트 되면서 express내장 기능으로 추가 된듯)
// app.use(express.urlencoded({ extended: false }));

const createUser = async (req, res) => {
  //유저 회원가입 하기
  try {
    const { email, nickname, password, profile_image, phoneNumber } =
      req.body.data;

    // const REQUIRED_KEYS = [
    //   email,
    //   nickname,
    //   password,
    //   profile_image,
    //   phoneNumber,
    // ];

    // REQUIRED_KEYS.map((key) => {
    //   if (key.length === 0) {
    //     // !key도 가능
    //     throw new Error(`KEY_ERROR`);
    //   }
    // });

    const REQUIRED_KEYS = {
      email,
      nickname,
      password,
      profile_image,
      phoneNumber,
    };

    Object.keys(REQUIRED_KEYS).flatMap((key) => {
      if (!REQUIRED_KEYS[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });

    if (!email.includes("@") || !email.includes(".")) {
      // 이메일에 @ or . 이 포함되지 않으면 error를 날린다.
      throw new Error("Email-Invalid"); // throw new Error가 자세히 어떻게 동작이 되는지?
    }

    if (password.length < 10) {
      //비밀번호가 10자리 이상만 가능 아니면 error 날림
      throw new Error("Password-Invalid");
    }

    const [_, frontNum, backNum] = phoneNumber.split("-");
    if (password.includes(frontNum || backNum)) {
      // 핸드폰 번호가 비밀번호에 포함되어있을때 error 발생
      throw new Error("Phone number is included in the password");
    }

    //이미 DB에 존재하는 Email로는 가입할 수 없음
    // const mailInfo = await myDataSource.query(
    //   `SELECT * FROM users WHERE email = "${email}"`
    // );
    // if (!mailInfo) {
    //   throw new Error("Can't sign up already exists email");
    // }

    const salt = bcrypt.genSaltSync(10);

    const hashedPw = bcrypt.hashSync(password, salt);

    const userInfo = await myDataSource.query(
      `INSERT INTO users ( email, nickname, password, profile_image)
      VALUES (
        "${email}", "${nickname}", "${hashedPw}", "${profile_image}"
        )`
    );
    res.status(200).json({ message: "userCreated" });
  } catch (err) {
    // console.log(err);
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Can't sign up already exists email" });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.data;

    const REQUIRED_KEYS = {
      email,
      password,
    };

    Object.keys(REQUIRED_KEYS).flatMap((key) => {
      if (!REQUIRED_KEYS[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });

    //email이 존재하는지 확인하고 없으면 userDoesNotExist 에러 메시지를 보냄
    const userInfo = myDataSource.query(`
    SELECT * FROM users 
    WHERE email ="${email}"`);
    console.log(userInfo);
    if (!userInfo) {
      throw new Error("userDoesNotExist");
    }

    const loginInfo = myDataSource.query(`
    SELECT id FROM users 
    WHERE email ="${email}"`);
    const token = jwt.sign(
      { loginInfo, iat: Math.floor(Date.now() / 1000) - 30 },
      "seonghee"
    );
    // console.log(loginInfo);

    res.status(200).json({ message: "loginSuccess", token: token });
  } catch {
    res.status(404).json({ message: err.message });
  }
};

const addPost = async (req, res) => {
  //게시글 Create
  try {
    const { user_id, title, content } = req.body.data;

    // 1. users 테이블에 존재하는 즉 회원가입한 사람만 포스팅을 할 수 있게 한다.
    const userInfo = await myDataSource.query(
      `SELECT * FROM users WHERE id = ${user_id}`
    );
    if (!userInfo) {
      throw new Error("sign up");
    }
    // 2.title & content 내용이 없을때
    const REQUIRED_KEYS = [title, content];
    REQUIRED_KEYS.map((key) => {
      if (key === "undefined") {
        throw new Error("posting invalid");
      }
    });

    const postInfo = await myDataSource.query(
      `INSERT INTO postings (user_id, title, contents) VALUES ('${user_id}', '${title}', '${content}')`
    );
    // console.log(postInfo);
    res.status(200).json({ message: "postCreated" });
  } catch (err) {
    // console.log(err); //터미널에서 확인하는 용도
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      res.status(400).json({ message: "YOU NEED SIGN UP" });
    }
    res.status(400).json({ message: err.message });
  }
};

const postList = async (req, res) => {
  //게시글 Read1

  const listInfo = await myDataSource.query(`SELECT
  users.id as userId,
  users.profile_image as userProfileImage,
  postings.id as postingId,
  posting_images.image_url userProfileUrl,
  postings.contents as postingContent
  FROM users, postings, posting_images
  WHERE users.id = postings.user_id && postings.id = posting_images.posting_id`);

  res.status(201).json({ data: listInfo });
};

//read2 문제 한명의 유저가 작성한 게시글 조회 함수 나중에 하기
const userPost = async (req, res) => {
  const { id } = req.body.data;

  const listInfo = await myDataSource.query(`SELECT
  postings.user_id,
  users.profile_image,
  posting_images.posting_id,
  posting_images.image_url,
  postings.contents
  FROM users, posting_images
  INNER JOIN postings ON ${id} = postings.user_id`);

  res.status(201).json({ data: listInfo });
};
//게시글 정보 수정 CRUD중 UPDATE 부분
const postChange = async (req, res) => {
  try {
    const { id, postingId, content } = req.body.data;

    const REQUIRED_KEYS = { id, postingId, content };

    Object.keys(REQUIRED_KEYS).Map((key) => {
      if (!REQUIRED_KEYS[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });

    const postChange = await myDataSource.query(`
      UPDATE postings SET contents = "${content}" WHERE user_id = ${id} && id = ${postingId}
    `);

    // console.log(postChange);
    const postChangeInfo = await myDataSource.query(`
      SELECT
      users.id as userId,
      users.nickname as userName,
      postings.id as postingId,
      postings.title as postingTitle,
      postings.contents as postingContent
      FROM users, postings
      WHERE users.id = ${id} && postings.id = ${postingId}
    `);

    res.status(201).json({ data: postChangeInfo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//유저가 작성한 해당 게시물 삭제 함수 CRUD중 DELETE 부분
const removePost = async (req, res) => {
  try {
    const { id, postingId } = req.body.data;

    const REQUIRED_KEYS = { id, postingId };

    Object.keys(REQUIRED_KEYS).Map((key) => {
      if (!REQUIRED_KEYS[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });
    const removePost = myDataSource.query(`
    DELETE FROM postings
    WHERE user_id = ${id} && id = ${postingId}
  `);

    res.status(200).json({ message: "postingDeleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

app.get("/", (req, res) => {
  res.json({ message: "success" });
});

app.post("/signup", createUser);
app.get("/login", loginUser);
app.post("/addpost", addPost);
app.get("/postlist", postList);
app.patch("/postchange", postChange);
app.delete("/removepost", removePost);
app.get("/userpostinfo", userPost);

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("start server http://localhost:3000/");
});
