const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

// Registrazione
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hash });
  await user.save();
  res.status(201).send({ message: 'Registrazione avvenuta' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ message: 'Credenziali errate' });
  }
  const token = jwt.sign({ sub: user._id }, 'TUA_CHIAVE_SEGRETA', { expiresIn: '1h' });
  res.send({ token });
});

module.exports = router;
