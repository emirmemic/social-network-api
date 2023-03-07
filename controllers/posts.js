const { Post } = require("../models/Posts");
const { User }  = require("../models/Users");
const jwt = require("jsonwebtoken");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate({
    path: "author",
    model: "users",
    select: "username email -_id"
  });
  res.json(posts);
};

const createPost = async (req, res) => {
  console.log("creating post");
  const post = req.body;
  const newPost = new Post(post);
  const token = req.header("Authorization").replace("Bearer ", "");
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  newPost.author = userId;
  await newPost.save();
  console.log("New post created:", newPost);
  res.json(newPost);
};

module.exports = { getAllPosts, createPost };
