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

const addPost = async (title, content, user_id) => {
  await myDataSource.query(`
    INSERT INTO postings (title, contents, user_id)
    VALUES ("${title}", "${content}", ${user_id})
    `);
};

module.exports = { addPost };
