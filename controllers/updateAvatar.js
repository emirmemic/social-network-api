const { User } = require("../models/Users");

const updateAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Korisnik nije pronađen" });
    }

    res.json({ success: true, avatar: user.avatar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

module.exports = { updateAvatar };