const express = require("express");
const usersController = require("../controllers/users");
const router = express.Router();

router.post("/searchUsers", usersController.searchUsers);
router.get("/getCurrentUser", usersController.getCurrentUser);

module.exports = router;