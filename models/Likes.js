const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

const Like = mongoose.model("likes", likeSchema);

module.exports = {Like};
