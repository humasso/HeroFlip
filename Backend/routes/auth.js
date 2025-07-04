const express = require('express');
const bcrypt  = require('bcrypt');
const User    = require('../models/User');
const router  = express.Router();

require('dotenv').config();
//const formattedString  = require('../functions/formattedString');
// Registrazione
router.post('/register', async (req, res) => {
  const { username, name, surname, email, password, favoriteHero, avatar } = req.body;

  console.log('Registrazione:', username, name, surname, email, password, favoriteHero, avatar); //debug

  if (!username || !name || !surname || !email || !password || !favoriteHero) {
    return res.status(400).send("Tutti i campi sono obbligatori");
  }
  
  // Nome
  if (name == undefined || name == "") {
    res.status(400).send("Nome mancante");
    return;
  }

  if ((/[^^[A-Za-z\s]+$]/.test(name))) {
    res.status(400).send("Inserire un nome valido");
    return;q
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

  //name = formattedString(name);
  //surname = formattedString(surname);
  //email = email.trim().toLowerCase();

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, surname, email, favoriteHero, password: hash, avatar });

  if(await User.findOne({username: username})) {
    console.log('Username già in uso');
    return res.status(400).send('Username già in uso');
  }


  try {
    await user.save();
    console.log('Registrazione avvenuta ');
    res.status(201).json({ message: 'Registrazione avvenuta' });
  } catch (err) {
    console.error('❌ Errore in /register:', err); //debug 
    if (err.code === 11000) {
      return res.status(400).send("Email già in uso");
    }
    res.status(400).send("Errore Server Interno");
  }
});

// Login
router.post('/login', async (req, res) => {

  try {
  const { username, password } = req.body;
  console.log('Login:', username, password); //debug
  
  // Username
  if (username == undefined || username == "") {
    return res.status(400).send('Username mancante');
  }
  // Password
  if (password == undefined || password == "") {
    res.status(400).send("Password mancante");
    return;
  }
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log('Credenziali errate', username, password, await bcrypt.compare(password, user.password)); //debug
    return res.status(400).send("Credenziali errate");
  }
  //const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '1h' });
  //res.status(201).send({ message: 'Login avvenuto' });
  res.send({_id: user._id });
  console.log('Login avvenuto', user._id); //debug

  } catch (err) {
    console.error('❌ Errore in /login:', err); //debug
    res.status(500).send("Errore Server Interno");
  }
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