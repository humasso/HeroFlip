const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Album = require('../models/Album');
require('dotenv').config();

const API_URL = process.env.HERO_API;

router.post('/open/:id', async (req, res) => {
  try {
    const { packType } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const pack = user.packs.find(p => p.packType === packType);
    if (!pack || pack.quantity < 1) {
      return res.status(400).json({ message: 'Pacchetti insufficienti' });
    }

    pack.quantity -= 1;
    await user.save();

    const ids = Array.from({ length: 5 }, () => Math.floor(Math.random() * 732) + 1);
    const heroes = [];
    for (const id of ids) {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      heroes.push({ heroId: data.id, name: data.name, image: data.image?.url });
    }

    let album = await Album.findOne({ user: req.params.id });
    if (!album) {
      album = new Album({ user: req.params.id, cards: [] });
    }

    for (const h of heroes) {
      const existing = album.cards.find(c => c.heroId === h.heroId);
      if (existing) {
        existing.quantity += 1;
      } else {
        album.cards.push({ ...h, quantity: 1 });
      }
    }
    await album.save();

    // Return anche degli eroi appena trovati 
    res.json({ ids, heroes, packs: user.packs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;