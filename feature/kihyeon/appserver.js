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
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ message: "/appppong" });
});

// 전체 유저 리스트 조회
app.get("/users", async (req, res) => {
  const userData = await myDataSource.query(`SELECT * FROM users`);
  console.log(userData);
});

// 유저 회원가입
app.post("/signup", async (req, res) => {
  const { nickname, email, password, profile_image } = req.body;
  const Data = await myDataSource.query(
    `INSERT into users (email, nickname, password, profile_image) values ('${email}', '${nickname}', '${password}', '${profile_image}')`
  );
  res.json({ message: "userCreated" });
});

// 게시물 생성
app.post("/createpost", async (req, res) => {
  const { id, content } = req.body;
  const Data = await myDataSource.query(
    `INSERT into postings (user_id, contents) values ('${id}', '${content}')`
  );
  res.json({ message: "postCreated" });
});

// 전체 게시글 조회
app.get("/postList", async (req, res) => {
  const postdata =
    await myDataSource.query(`select users.id as userId, users.profile_image as userProfileImage, postings.id as postingId, posting_images.image_url as postingImageUrl,
  postings.contents as postingContent
  from postings
  join users on users.id = postings.user_id
  left join posting_images on posting_images.posting_id = postings.id`);

  res.json({ data: postdata });
});

// user의 게시글 조회
app.post("/postList", async (req, res) => {
  const { id } = req.body;
  const postdata =
    await myDataSource.query(`select postings.id as postingId, posting_images.image_url as postingImageUrl, postings.contents as postingContent
  from postings
  join users on users.id = postings.user_id
  left join posting_images on posting_images.posting_id = postings.id
  where users.id = '${id}'
  `);
  const profiledata = await myDataSource.query(
    `select profile_image from users where id = '${id}'`
  );

  res.json({
    data: {
      userId: id,
      userProfileImage: profiledata[0].profile_image,
      postings: postdata,
    },
  });
});

const server = http.createServer(app);

server.listen(8000, "127.0.0.1", () => {
  console.log("server is listening on PORT 8000");
});
