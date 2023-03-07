const { Comment } = require("../models/Comments");
const { User } = require("../models/Users");
const jwt = require("jsonwebtoken");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate({
      path: "author",
      model: "users",
      select: "username email -_id",
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const commentPost = async (req, res) => {
  let comment = {};
  const post = req.body.post;
  const token = req.header("Authorization").replace("Bearer ", "");
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  comment.author = userId;
  comment.post = post;
  comment.content = req.body.comment;
  await Comment.create(comment);
  res.json(comment);
};

module.exports = { commentPost, getAllComments };
