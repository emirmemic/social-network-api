const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Post = mongoose.model("posts", postSchema);
module.exports = { Post };
