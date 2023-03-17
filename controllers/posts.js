const { Post } = require("../models/Posts");
const { User }  = require("../models/Users");
const jwt = require("jsonwebtoken");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate({
    path: "author",
    model: "users",
    select: "username email -_id"
  });
  posts.reverse()
  res.json(posts);
};

const getPost = async (req, res) => {
  console.log("getting post")
  const post = await Post.findById(req.params.id).populate({
    path: "author",
    model: "users",
    select: "username email -_id"
  });
  console.log(post)
  res.json(post);
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

const likePost = async (req, res) => {
  try {
    // Pronaći post
    const post = await Post.findById(req.params.id);

    // Provjeriti da li post postoji
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    // Provjeriti da li je korisnik već lajkovao post
    if (post.likes.includes(req.user._id)) {
      return res.status(400).send({ error: "Post already liked" });
    }

    // Dodati korisnikov id u niz lajkova i sačuvati post
    post.likes.push(req.user._id);
    await post.save();

    res.send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};


module.exports = { getAllPosts, createPost, getPost, likePost };
