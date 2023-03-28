const { Post } = require("../models/Posts");
const jwt = require("jsonwebtoken");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate({
    path: "author",
    model: "users",
    select: "username email _id",
  });
  posts.reverse();
  res.json(posts);
};

const getPost = async (req, res) => {
  console.log("getting post");
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "author",
      model: "users",
      select: "username email _id",
    });
    console.log(post);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
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

const updatePost = async (req, res) => {
  const id = req.params.id;
  const token = req.header("Authorization").replace("Bearer ", "");
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).send({ error: "Post not found" });
  }
  if (post.author._id.toString() !== userId) {
    return res.status(401).send({ error: "Not your post" });
  }
  console.log("updating post");
  try {
    post = await Post.findByIdAndUpdate(
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

    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

const deletePost = async (req, res) => {
  console.log("deleting post");

  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    res.send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).send({ error: "Post already liked" });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPost,
  likePost,
  updatePost,
  deletePost,
};
