const express = require("express");
const postsController = require("../controllers/posts");
const router = express.Router();

router.get("/getAll", postsController.getAllPosts);
router.get("/:id", postsController.getPost);
router.post("/create", postsController.createPost);
router.delete("/deletePost/:id", postsController.deletePost);
router.put("/updatePost/:id", postsController.updatePost);


module.exports = router;
