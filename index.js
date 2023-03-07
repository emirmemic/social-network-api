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
const jwt = require('jsonwebtoken');
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts")
const commentRouter = require("./routes/comments")
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

  const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).send('Access denied.');
    }
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).send('Invalid token.');
    }
  };

app.use("/api/comments", verifyToken, commentRouter);
app.use("/api/users", verifyToken, usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", verifyToken, postRouter )

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



app.listen(process.env.PORT, () => {
  console.log("Server running on port 3001");
});
