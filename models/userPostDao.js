const myDataSource = require("./index");

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
