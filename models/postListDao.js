const myDataSource = require("./index");

const postList = async () => {
  const listInfo = await myDataSource.query(`SELECT
  * FROM postings`);

  return listInfo;
};

module.exports = { postList };
