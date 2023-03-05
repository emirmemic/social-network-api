const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

router.post("/login", authController.Login);
router.post("/register", authController.Register);

module.exports = router;
