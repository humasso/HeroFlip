const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

// Registrazione
router.post('/register', async (req, res) => {
  const { username, name, surname, email, password, favoriteHero} = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, surname, email, favoriteHero, password: hash });
  await user.save();
  res.status(201).send({ message: 'Registrazione avvenuta' });
  
  res.send('<h1>siamo in register</h1>');
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


/*

// giorgio
router.post('/giorgio', async (req, res) => {
  const ciao = 'ciao da giorgio'
  res.status(201).send({ message: 'giorgio presente' });
});

//IF i MOD 2 != 0 THEN

*/