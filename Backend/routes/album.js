const express = require('express');
const Album = require('../models/Album');
const router = express.Router();

// Get album for user
router.get('/:userId', async (req, res) => {
  try {
    let album = await Album.findOne({ user: req.params.userId });
    if (!album) {
      album = await Album.create({ user: req.params.userId, cards: [] });
    }
    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Add cards to album
router.post('/add/:userId', async (req, res) => {
  try {
    const cards = req.body.cards || [];
    let album = await Album.findOne({ user: req.params.userId });
    if (!album) {
      album = new Album({ user: req.params.userId, cards: [] });
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

module.exports = router;