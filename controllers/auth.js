const { User } = require("../models/Users");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, async (err, user) => {
    if (err) {
      res.status(500).json({ error: "Greška na serveru" });
    } else if (!user) {
      res
        .status(401)
        .json({ error: "Ne postoji korisnik s ovom adresom e-pošte" });
    } else {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        res.status(200).json({ success: true, user, token });
      }
    }
  });
};

const Register = async (req, res) => {
  const userData = req.body;

  // Validacija podataka koji su poslani u zahtjevu
  if (!userData.username || !userData.password || !userData.email) {
    res.status(400).send("Nedostaju obavezna polja za registraciju.");
    return;
  }

  // Kreiranje novog korisnika
  const newUser = new User(userData);

  // Čuvanje korisnika u bazi podataka
  newUser.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Greška prilikom čuvanja korisnika.");
      return;
    }

    // Uspješna registracija
  });
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.status(200).json({ success: true, newUser, token });
};

module.exports = { Login, Register };
