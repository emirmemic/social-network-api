const { Comment } = require("../models/Comments");
const jwt = require("jsonwebtoken");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate({
      path: "author",
      model: "users",
      select: "username email _id",
    });
    comments.reverse();
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

const updateComment = async (req, res) => {
  const id = req.params.id;
  const token = req.header("Authorization").replace("Bearer ", "");
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).send({ error: "Comment not found" });
  }
  if (comment.author._id.toString() !== userId) {
    return res.status(401).send({ error: "Not your comment" });
  }
  console.log("updating comment");
  try {
    comment = await Comment.findByIdAndUpdate(
      {
        _id: id,
      },
      { ...req.body },
      { new: true }
    ).populate({
      path: "author",
      model: "users",
      select: "username email _id",
    });
    console.log(comment);
    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteComment = async (req, res) => {
  const id = req.params.id;
  const token = req.header("Authorization").replace("Bearer ", "");
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).send({ error: "Comment not found" });
  }
  if (comment.author._id.toString() !== userId) {
    return res.status(401).send({ error: "Not your comment" });
  }
  await Comment.findByIdAndDelete(id);
  res.json({ message: "Comment deleted" });
};

module.exports = { commentPost, getAllComments, updateComment, deleteComment };
