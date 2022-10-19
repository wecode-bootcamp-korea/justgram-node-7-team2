const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql"); // 이거 내가 왜 넣었지??

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

// server 테스트 url
app.get("/ping", (req, res, next) => {
  res.json({ message: "/pong" });
});

// userList 가져오기
const userList = async (req, res) => {
  const userData = await myDataSource.query(`SELECT * FROM users;`);

  console.log("result : ", userData);

  res.status(200).json({ users: userData });
};

// userCreated 회원 가입
const userSignup = async (req, res) => {
  const { nickname, email, password, profile_image } = req.body;

  await myDataSource.query(`
    INSERT INTO users (nickname, email, password, profile_image)
    VALUES 
      ('${nickname}', '${email}', '${password}', '${profile_image}');
    `);
  const checkSignUp = await myDataSource.query(`
    select * from users where nickname='${nickname}';
    `);

  console.log(checkSignUp);
  res.status(201).json({ message: "userCreated" });
};

//  /posting, addPost 포스트 게시하기
const addPost = async (req, res) => {
  const { user_id, contents, image_url } = req.body;

  // let postingPk;
  await myDataSource.query(
    `
      INSERT INTO postings (user_id, contents)
      VALUES ('${user_id}', '${contents}');      
    `
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
      WHERE p.user_id = '${user_id}'
      ;`);
  console.log(checkAddPost);
  res.status(201).json({ message: "postCreated" });
};

// 게시글 전체 리스트 불러오기
// Read 1
async function postList(req, res) {
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
}

// 1명의 게시글 리스트 불러오기
// Read 2
async function userPostList(req, res) {
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
}

// 게시물 update, 수정
async function updatePost(req, res) {
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

  const check = await myDataSource.query(`
    SELECT 
      u.id userId,
      u.nickname userName,
      p.id postingId,
      p.contents postingContent
    FROM postings p 
      inner join users u 
      on p.user_id = u.id 
    WHERE p.id = '${id}'  
  ;`);

  console.log(check);
  res.status(201).json({ data: check });
}

// 게시물 Delete, 삭제
async function deletePost(req, res) {
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
}

// url 정리
app.get("/users", userList);
app.post("/signup", userSignup);
app.post("/post", addPost);
app.get("/post", postList);
app.post("/post/user", userPostList);
app.patch("/post", updatePost);
app.delete("/post", deletePost);

const server = http.createServer(app);

server.listen(8000, () => {
  console.log("server is listening on PORT 8000");
});
