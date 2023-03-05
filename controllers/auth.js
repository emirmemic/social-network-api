const {User} = require("../models/Users")


const Login = async(req, res) => {
  const { email, password } = req.body;

  // Potrebno je izvršiti validaciju ovdje
  console.log('test')

  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Greška na serveru' });
    } else if (!user) {
      res.status(401).json({ error: 'Ne postoji korisnik s ovom adresom e-pošte' });
    } else {
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ error: 'Greška na serveru' });
        } else if (!isMatch) {
          res.status(401).json({ error: 'Kriva lozinka' });
        } else {
          // Uspješan prijavljivanje
          res.status(200).json({ success: true });
        }
      });
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
  res.json(userData);
};

module.exports = {Login, Register};