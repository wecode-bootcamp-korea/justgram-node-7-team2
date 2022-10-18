const http = require("http");
const express = require("express");
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
app.use(express.json()); //req.body undefined 에러 해결(아마 express사용시 발생하는 에러인듯? 전에는 body-parser Install해서 해결한 기억이 있는데 그게 express 업데이트 되면서 express내장 기능으로 추가 된듯)
// app.use(express.urlencoded({ extended: false }));

const createUser = async (req, res) => {
  //유저 회원가입 하기

  let { email, nickname, password, profile_image } = req.body.data;

  const userInfo = await myDataSource.query(
    `INSERT INTO users ( email, nickname, password, profile_image) VALUES ("${email}", "${nickname}", "${password}", "${profile_image}")`
  );

  res.status(200).json({ message: "userCreated" });
};

const addPost = async (req, res) => {
  //게시글 Create

  const { user_id, content } = req.body.data;

  const postInfo = await myDataSource.query(
    `INSERT INTO postings (user_id, contents) VALUES ('${user_id}', '${content}')`
  );
  console.log(postInfo);
  res.status(200).json({ message: "postCreated" });
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
  const { id, postingId, content } = req.body.data;
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
};

const removePost = async (req, res) => {
  const { id, postingId } = req.body.data;

  const removePost = myDataSource.query(`
    DELETE FROM postings
    WHERE user_id = ${id} && id = ${postingId}
  `);

  res.status(200).json({ message: "postingDeleted" });
};

app.get("/", (req, res) => {
  res.json({ message: "success" });
});

app.post("/signup", createUser);
app.post("/addpost", addPost);
app.get("/postlist", postList);
app.patch("/postchange", postChange);
app.delete("/removepost", removePost);
app.get("/userpostinfo", userPost);

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("start server http://localhost:3000/");
});
