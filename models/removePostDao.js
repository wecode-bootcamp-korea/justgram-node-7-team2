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

const removePost = async (postingId, user_id) => {
  console.log(postingId, user_id);
  const removePost = await myDataSource.query(`
    DELETE FROM postings
    WHERE user_id = ${user_id} && id = ${postingId}
  `);
};

module.exports = { removePost };
