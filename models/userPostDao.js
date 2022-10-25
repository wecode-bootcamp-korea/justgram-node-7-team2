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

const userPost = async (id) => {
  const listInfo = await myDataSource.query(`SELECT
  users.id as userId,
  users.profile_image,
  posting_images.posting_id,
  postings.id as postingId,
  postings.contents as postingContent,
  posting_images.image_url as postingImageUrl
  FROM users, postings, posting_images
  WHERE users.id = 1 && postings.user_id = users.id && postings.id = posting_images.posting_id`);

  return listInfo;
};

module.exports = { userPost };
