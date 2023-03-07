const { User } = require("../models/Users");

const searchUsers = async (req, res) => {
  try {
    const users = await User.find({ username: { $regex: req.body.searchTerm, $options: "i" } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { searchUsers };
