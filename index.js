const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/Users");
const { Post } = require("./models/Posts");
const { Comment } = require("./models/Comments");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const authRouter = require("./routes/auth");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DB_STRING, {
    bufferCommands: false,
  })
  .then(() => console.log("MongoDB povezan..."))
  .catch((err) => console.log(err));

app.use("/api/auth", authRouter);

app.get("/getComments", (req, res) => {
  Comment.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});
app.post("/createComment", async (req, res) => {
  const comment = req.body;
  const newComment = new Comment(comment);
  await newComment.save();
  res.json(comment);
});

app.get("/getPosts", async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
});

app.post("/createPost", async (req, res) => {
  const post = req.body;
  const newPost = new Post(post);
  await newPost.save();
  console.log("New post created:", newPost);
  res.json(newPost);
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 3001");
});
