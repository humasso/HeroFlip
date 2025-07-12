const express = require('express');
const mongoose = require('mongoose');
const Album = require('../models/Album');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Album
 *   description: Gestione album delle carte
 */

/**
 * @swagger
 * /album/{userId}:
 *   get:
 *     summary: Ottiene l'album di un utente
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Album dell'utente
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    let album = await Album.findOne({ user: userId });
    if (!album) {
      album = await Album.create({ user: userId, cards: [] });
    }
    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /album/add/{userId}:
 *   post:
 *     summary: Aggiunge carte all'album di un utente
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cards:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Album aggiornato
 */
router.post('/add/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const cards = req.body.cards || [];
    let album = await Album.findOne({ user: userId });
    if (!album) {
      album = new Album({ user: userId, cards: [] });
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