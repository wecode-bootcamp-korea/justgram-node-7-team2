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

const postChange = async (postingId, content, user_id) => {
  const postChange = await myDataSource.query(`
      UPDATE postings SET contents = "${content}" WHERE user_id = ${user_id} && id = ${postingId}
    `);

  const postChangeInfo = await myDataSource.query(`
      SELECT
      users.id as userId,
      users.nickname as userName,
      postings.id as postingId,
      postings.title as postingTitle,
      postings.contents as postingContent
      FROM users, postings
      WHERE users.id = ${user_id} && postings.id = ${postingId}
    `);

  return postChangeInfo;
};

module.exports = { postChange };
