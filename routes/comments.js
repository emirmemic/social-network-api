const express = require("express");
const commentController = require("../controllers/comments");
const router = express.Router();

router.get("/getComments/:id", commentController.getAllComments);
router.post("/createComment", commentController.commentPost);
router.delete("/deleteComment/:id", commentController.deleteComment);
router.put("/updateComment/:id", commentController.updateComment);

module.exports = router;