const express = require("express");
const postsController = require("../controllers/posts");
const router = express.Router();

router.get("/getAll", postsController.getAllPosts);
router.post("/create", postsController.createPost);

module.exports = router;
