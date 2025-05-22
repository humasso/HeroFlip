const express = require('express');
const User    = require('../models/User');
const bcrypt  = require('bcrypt');
const router  = express.Router();
require('dotenv').config();


// GET /api/user/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// PUT /api/user/pass/:id
router.put('/pass/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });
        console.log(req.body.oldPassword);
        console.log(user.password);
        if (!(await bcrypt.compare(req.body.oldPassword, user.password))) return res.status(400).json({ message: 'Password errata' });

        const { password } = req.body.newPassword;
        user = await User.findByIdAndUpdate(req.params.id, { password }, { new: true });
        res.status(200).json({ message: 'Password aggiornata' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore server' });
    }
});

// PUT /api/user/username/:id
router.put('/username/:id', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { username }, { new: true });
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore server' });
    }
});

// DELETE /api/user/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Utente non trovato' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;