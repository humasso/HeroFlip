const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Album = require('../models/Album');
const bcrypt = require('bcrypt');

// Lista di tutti gli utenti
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Aggiorna crediti (positivo o negativo)
router.patch('/credits/:id', async (req, res) => {
  try {
    const amount = parseInt(req.body.amount, 10) || 0;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { credits: amount } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Aggiorna pacchetti (quantità può essere negativa)
router.patch('/packs/:id', async (req, res) => {
  try {
    const { packType, qty } = req.body;
    const quantity = parseInt(qty, 10) || 0;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    let pack = user.packs.find(p => p.packType === packType);
    if (!pack) {
      user.packs.push({ packType, quantity: quantity });
    } else {
      pack.quantity += quantity;
      if (pack.quantity < 0) pack.quantity = 0;
    }
    await user.save();
    res.json(user.packs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Aggiungi carte all'album
router.post('/cards/:id', async (req, res) => {
  try {
    const cards = req.body.cards || [];
    let album = await Album.findOne({ user: req.params.id });
    if (!album) {
      album = new Album({ user: req.params.id, cards: [] });
    }
    for (const c of cards) {
      const existing = album.cards.find(card => card.heroId === c.heroId);
      if (existing) {
        existing.quantity += 1;
      } else {
        album.cards.push({ heroId: c.heroId, name: c.name, image: c.image, quantity: 1 });
      }
    }
    await album.save();
    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Cambia password utente
router.put('/password/:id', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Password aggiornata' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;