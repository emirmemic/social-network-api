const express = require("express");
const likeController = require("../controllers/likes");
const router = express.Router();

router.get("/createLike/:id", likeController.createLike);
router.get("/getAllLikes/:id", likeController.getAllLikes);

module.exports = router;
