const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();
const connectDB = require('../functions/dbconnection');
require('dotenv').config();

// Registrazione
router.post('/register', async (req, res) => {
  const { username, name, surname, email, password, favoriteHero} = req.body;
  if (!username || !name || !surname || !email || !password || !favoriteHero) {
    return res.status(400).send({ message: 'Tutti i campi sono obbligatori' });
  }
  
  // Nome
  if (name == undefined || name == "") {
    res.status(400).send("Nome mancante");
    return;
  }

  if ((/[^^[A-Za-z\s]+$]/.test(name))) {
    res.status(400).send("Inserire un nome valido");
    return;
  }

  // Cognome
  if (surname == undefined || surname == "") {
    res.status(400).send("Cognome mancante");
    return;
  }

  if ((/[^^[A-Za-z\s]+$]/.test(surname))) {
    res.status(400).send("Inserire un cognome valido");
    return;
  }

  // Email
  if (email == undefined || email == "") {
    res.status(400).send("Email mancante");
    return;
  }
  if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    res.status(400).send("Inserire un email corretta");
    return;
  }

  // Username
  if (username == undefined || username == "") {
    return res.status(400).send('Username mancante');
  }


  // Password
  if (password == undefined || password == "") {
    res.status(400).send("Password mancante");
    return;
  }

  if (password.length < 6) {
    res.status(400).send("La password deve essere lunga almeno 6 caratteri");
    return;
  }
  if (!(/[^a-zA-Z0-9_]/.test(password))) {
    res.status(400).send("La password deve contenere almeno un carattere speciale");
    return;
  }
  if (!(/\d/.test(password))) {
    res.status(400).send("La password deve contenere almeno un numero");
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, surname, email, favoriteHero, password: hash });
  connectDB();

  if(await User.findOne({username: username})) {
    console.log('Username già in uso');
    return res.status(400).send('Username già in uso');
  }

  try {
    await user.save();
    console.log('Registrazione avvenuta ');
    res.status(201).send({ message: 'Registrazione avvenuta' });
  } catch (err) {
    console.error('❌ Errore in /register:', err); //debug 
    if (err.code === 11000) {
      return res.status(400).send({ message: 'Email già in uso' });
    }
    res.status(400).json({ error: "Errore Server Interno" });
  }

});

// Login
router.post('/login', async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  connectDB();
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ message: 'Credenziali errate' });
  }
  const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '1h' });
  //res.status(201).send({ message: 'Login avvenuto' });
  res.send({ token });
});

module.exports = router;

router.get('/test', (req, res) => {
  res.send('<h1>siamo in test</h1>');
})

/*

// giorgio
router.post('/giorgio', async (req, res) => {
  const ciao = 'ciao da giorgio'
  res.status(201).send({ message: 'giorgio presente' });
});

//IF i MOD 2 != 0 THEN

*/