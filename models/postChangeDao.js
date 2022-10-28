const myDataSource = require("./index");

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
