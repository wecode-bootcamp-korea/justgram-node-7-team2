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
  console.log("postDao - Data Source has been initialized!");
});

const createPost = async (contents, id) => {
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
    LEFT JOIN posting_images pi2
      ON p.id = pi2.posting_id
    WHERE p.user_id = '${id}'
    ;`);

  console.log("dao id :", id);
  console.log("userDao checkAddPost : ", checkAddPost);
  return checkAddPost;
};

const postList = async () => {
  const result = await myDataSource.query(`   
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

  return result;
};

const userPostList = async (id) => {
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

  console.log("dao data: ", posting);

  return posting;
};

const updatePost = async (user_id, id, contents) => {
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

  console.log("dao update:", data);
  return data;
};

const deletePost = async (id) => {
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

  return check;
};

const readPost = async (id) => {
  const data = await myDataSource.query(`
    update postings 
    set view_cnt = view_cnt + 1
    where id = '${id}'
  `);

  const result = await myDataSource.query(`
  SELECT * from postings
  where id = '${id}'
  `);

  return result;
};

module.exports = {
  createPost,
  postList,
  userPostList,
  updatePost,
  deletePost,
  readPost,
};
