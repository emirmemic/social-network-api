const { Like } = require("../models/Likes");
const jwt = require("jsonwebtoken");

const createLike = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const existingLike = await Like.findOne({ author: userId, post: postId });
    if (existingLike) {
      await existingLike.remove();
      res.json("post disliked");
    } else {
      const like = { author: userId, post: postId };
      await Like.create(like);
      res.json("post liked");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllLikes = async (req, res) => {
  try {
    const likes = await Like.find({ post: req.params.id });
    res.json(likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createLike, getAllLikes };
