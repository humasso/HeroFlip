const express = require('express');
const User    = require('../models/User');
const router  = express.Router();
require('dotenv').config();


// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    console.log("sessa coglione!");
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.password) {
      // es. usa bcrypt.hash, qui semplifico
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash(req.body.password, 10);
      updateData.passwordHash = hash;
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Dati non validi', error: err.message });
  }
});

// DELETE /api/users/:id
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