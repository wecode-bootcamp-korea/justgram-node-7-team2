const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const {DataSource} = require('typeorm');
const myDataSource = new DataSource({
  type : process.env.TYPEORM_CONNECTION,
  host : process.env.TYPEORM_HOST,
  port : process.env.TYPEORM_PORT,
  username : process.env.TYPEORM_USERNAME,
  password : process.env.TYPEORM_PASSWORD,
  database : process.env.TYPEORM_DATABASE,
})

myDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');
})


app.get('/users', async(req, res)=>{
  //회원정보 가져오기
  const userData = await myDataSource.query(`SELECT * FROM users;`);

  console.log('result : ', userData );
  res.status(200).json({'User_information' : userData});
});


app.post('/join', async(req, res)=>{
  //회원가입
  const {nickname, email, password, profile_image} = req.body;

  await myDataSource.query(
    `INSERT INTO users (nickname, email, password, profile_image)
    VALUES ('${nickname}', '${email}', '${password}', '${profile_image}');`)

  const displayNewUser = await myDataSource.query(`SELECT * from users where nickname='${nickname}';`);

  console.log('Welcome! NewUser : ', displayNewUser );
  res.status(201).json({users : 'User_created'});
})


app.post('/posts', async(req, res)=>{
  //신규 게시물 작성
  const {user_id, contents} = req.body;
  
  await myDataSource.query(
    `INSERT INTO postings (user_id, contents)
    VALUES ('${user_id}', '${contents}');`)

  const displayNewArticle = await myDataSource.query(`SELECT * from postings where contents='${contents}';`);

  console.log('article posted! : ', displayNewArticle );
  res.status(201).json({message : 'article posted!'});
})


app.get('/posts', async(req, res)=>{
  //게시물 검색
  const {user_id} = req.body;
  
  if(!user_id){
    const articles = await myDataSource.query(`SELECT * FROM postings;`);
    console.log('articles! : ', articles );
    res.status(200).json({'articles!' : articles});
  
  } else {
    const filtered_articles = await myDataSource.query(`SELECT * FROM postings where user_id = ${user_id};`);
    console.log('filtered_articles! : ', filtered_articles );
    res.status(200).json({'articles!' : filtered_articles});
  }
})


app.patch('/posts', async(req, res)=> {
  //게시물 수정
  const {id, contents} = req.body;
  const selectedPosting = await myDataSource.query(`SELECT * FROM postings where id = ${id};`);
  console.log(selectedPosting);

  await myDataSource.query(`UPDATE postings SET contents = '${contents}' where id = '${id}';`);
  const modifiedContents = await myDataSource.query(`SELECT * FROM postings WHERE id = '${id}';`);

  res.status(200).json({'article modified!!' : modifiedContents});
})


app.delete('/posts', async(req, res)=> {
  //게시물 삭제
  const {id} = req.body;
  const selectedPosting = await myDataSource.query(`SELECT * FROM postings where id = ${id};`);
  console.log(selectedPosting);

  await myDataSource.query(`DELETE FROM postings where id = '${id}';`);
  res.status(200).json({message : 'posting deleted!'});
})



const server = http.createServer(app);
server.listen(8000, () => {
  console.log('server is listening on port 8000!!!');
});