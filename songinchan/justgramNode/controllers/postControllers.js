const postService = require("../services/postService");

const addPost = async (req, res) => {
  try {
    const { contents, image_url } = req.body;
    const { id } = req.userInfo[0];

    // error Handelig
    const REQUIRE_KEYS = { contents };
    Object.keys(REQUIRE_KEYS).map((key) => {
      if (!REQUIRE_KEYS[key]) {
        const error = new Error(`KEY_ERROR ${key}`);
        error.statusCode = 400;
        throw error;
      }
    });

    console.log(`Controllers userId is :${id}`);

    const result = await postService.addPost(contents, id);
    console.log("controller :", result);
    res.status(201).json({ message: "postCreated", result });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// --------------------------------------------------------------------------
// 게시글 전체 리스트 불러오기
// Read 1
const postList = async (req, res) => {
  try {
    const result = await postService.postList();
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// --------------------------------------------------------------------------
// 1명의 게시글 리스트 불러오기
// Read 2
const userPostList = async (req, res) => {
  try {
    const { id } = req.userInfo[0];

    console.log("user id :", id);

    const result = await postService.userPostList(id);

    res.status(201).json({ result });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id, contents } = req.body;
    const user_id = req.userInfo[0].id;

    const result = await postService.updatePost(user_id, id, contents);

    console.log(result);
    res.status(201).json({ data: result });
  } catch (err) {
    console.log(err);
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await postService.deletePost(id);

    console.log(result);
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  addPost,
  postList,
  userPostList,
  updatePost,
  deletePost,
};
