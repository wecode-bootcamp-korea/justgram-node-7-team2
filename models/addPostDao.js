const myDataSource = require("./index");

const addPost = async (title, content, user_id, image_url) => {
  await myDataSource.query(`
    INSERT INTO postings (title, contents, user_id)
    VALUES ("${title}", "${content}", ${user_id})
  `);

  let [posting_id] = await myDataSource.query(`
  SELECT LAST_INSERT_ID() FROM postings;
  `);
  [posting_id] = Object.values(posting_id);

  await myDataSource.query(`
    INSERT INTO posting_images (posting_id, image_url)
    VALUES (${posting_id}, "${image_url}")
  `);
};

module.exports = { addPost };
