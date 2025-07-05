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
    console.log(`Crediti aggiunti: ${credits} a ${user.username}`);
    res.json({ message: 'Crediti aggiunti', credits: user.credits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Acquisto pacchetti per l'utente specificato
router.post('/packs/:id', async (req, res) => {
  try {
    const { packType, qty, cost } = req.body;
    const quantity = parseInt(qty, 10);
    const totalCost = parseInt(cost, 10);

    if (!packType || !quantity || quantity <= 0 || !totalCost || totalCost <= 0) {
      return res.status(400).json({ message: 'Dati non validi' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    if (user.credits < totalCost) {
      return res.status(400).json({ message: 'Crediti insufficienti' });
    }

    user.credits -= totalCost;

    const pack = user.packs.find(p => p.packType === packType);
    if (pack) {
      pack.quantity += quantity;
    } else {
      user.packs.push({ packType, quantity });
    }

    await user.save();

    res.json({ message: 'Pacchetti acquistati', credits: user.credits, packs: user.packs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Apertura pacchetti
router.post('/open/:id', async (req, res) => {
  try {
    const { packType, qty } = req.body;
    const quantity = parseInt(qty, 10);
    if (!packType || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Dati non validi' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const pack = user.packs.find(p => p.packType === packType);
    if (!pack || pack.quantity < quantity) {
      return res.status(400).json({ message: 'Pacchetti insufficienti' });
    }

    pack.quantity -= quantity;
    await user.save();

    res.json({ message: 'Pacchetti aperti', packs: user.packs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;