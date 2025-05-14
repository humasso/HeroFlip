const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();
const connectDB = require('../functions/dbconnection');

// Registrazione
router.post('/register', async (req, res) => {
  const { username, name, surname, email, password, favoriteHero} = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, surname, email, favoriteHero, password: hash });
  connectDB();
  try {
    await user.save();
    console.log('Registrazione avvenuta ');
    res.status(201).send({ message: 'Registrazione avvenuta' });
  } catch (err) {
    console.error('❌ Errore in /register:', err);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ message: 'Credenziali errate' });
  }
  const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.send({ token });
  res.send('<h1>siamo in login</h1>');
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