const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Aggiunge crediti all'utente specificato
router.post('/credits/:id', async (req, res) => {
  try {
    const credits = parseInt(req.body.credits, 10);
    if (!credits || credits <= 0) {
      return res.status(400).json({ message: 'Crediti non validi' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { credits } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.json({ message: 'Crediti aggiunti', credits: user.credits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;