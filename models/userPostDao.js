const myDataSource = require("./index");

const userPost = async (id) => {
  const listInfo = await myDataSource.query(`
  SELECT
    users.id as userId,
    users.profile_image as userProfileImage,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          "postingId", postings.id,
          "postingImageUrl", posting_images.image_url,
          "postingContent",postings.contents
        )
      )as postings
  FROM users
  JOIN postings ON postings.user_id = users.id
  JOIN posting_images ON postings.id = posting_images.posting_id
  WHERE users.id = ${id}
  GROUP BY users.id`);

  return listInfo;
};

module.exports = { userPost };
