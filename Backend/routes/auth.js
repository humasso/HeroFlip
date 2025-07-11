const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestione autenticazione utenti
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - name
 *               - surname
 *               - email
 *               - password
 *               - favoriteHero
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               favoriteHero:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *       400:
 *         description: Dati non validi
 *       500:
 *         description: Errore server
 */

router.post('/register', async (req, res) => {
  try {
    const { username, name, surname, email, password, favoriteHero, avatar } = req.body;

    if (!username || !name || !surname || !email || !password || !favoriteHero) {
      return res.status(400).send('Tutti i campi sono obbligatori');
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return res.status(400).send('Nome non valido');
    }
    if (!/^[A-Za-z\s]+$/.test(surname)) {
      return res.status(400).send('Cognome non valido');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send('Email non valida');
    }
    if (
      password.length < 6 ||
      !/[^a-zA-Z0-9_]/.test(password) ||
      !/\d/.test(password)
    ) {
      return res.status(400).send('Password non valida');
    }
    if (await User.findOne({ username })) {
      return res.status(400).send('Username già in uso');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      name,
      surname,
      email,
      favoriteHero,
      password: hash,
      avatar
    });

    await user.save();
    res.status(201).json({ message: 'Registrazione avvenuta' });
  } catch (err) {
    console.error('Errore in /register:', err);
    if (err.code === 11000) {
      return res.status(400).send('Email già in uso');
    }
    res.status(500).send('Errore Server Interno');
  }
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Effettua il login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login effettuato
 *       400:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore server
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Credenziali mancanti');
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Credenziali errate');
    }

    res.send({ userid: user._id });
  } catch (err) {
    console.error('Errore in /login:', err);
    res.status(500).send('Errore Server Interno');
  }
});


// giorgio
router.get('/giorgio', (req, res) => {
  res.send('<h1>Giorgio è un grande!</h1>');
}); 


module.exports = router;


