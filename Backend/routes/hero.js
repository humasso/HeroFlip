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

    // Filtra i publisher in base al tipo di pacchetto
    let publisherFilter = null;
    const lower = packType.toLowerCase();
    if (lower.includes('marvel')) {
      publisherFilter = 'Marvel Comics';
    } else if (lower.includes('dc')) {
      publisherFilter = 'DC Comics';
    }

    const ids = [];
    const heroes = [];
    while (ids.length < 5) {
      const id = Math.floor(Math.random() * 732) + 1;
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      if (!publisherFilter || data.biography?.publisher === publisherFilter) {
        ids.push(data.id);
        heroes.push({ heroId: data.id, name: data.name, image: data.image?.url });
      }
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

    res.json({ ids, heroes, packs: user.packs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;