const myDataSource = require("./index");

const removePost = async (postingId, user_id) => {
  console.log(postingId, user_id);
  const removePost = await myDataSource.query(`
    DELETE FROM postings
    WHERE user_id = ${user_id} && id = ${postingId}
  `);
};

module.exports = { removePost };
