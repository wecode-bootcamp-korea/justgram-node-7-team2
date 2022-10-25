const myDataSource = require("./index");

const addPost = async (title, content, user_id) => {
  await myDataSource.query(`
    INSERT INTO postings (title, contents, user_id)
    VALUES ("${title}", "${content}", ${user_id})
    `);
};

module.exports = { addPost };
