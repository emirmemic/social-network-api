const { User } = require("../models/Users");
const jwt = require("jsonwebtoken");

const searchUsers = async (req, res) => {
  try {
    const users = await User.find({
      username: { $regex: req.body.searchTerm, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const user = await User.findOne({ _id: userId });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { searchUsers, getCurrentUser };
