const express = require("express");
const commentController = require("../controllers/comments");
const router = express.Router();

router.get("/getComments/:id", commentController.getAllComments);
router.post("/createComment", commentController.commentPost);

module.exports = router;