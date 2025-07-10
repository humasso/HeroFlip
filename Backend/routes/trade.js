const express = require('express');
const Trade = require('../models/Trade');
const User = require('../models/User');
const router = express.Router();

// Crea un nuovo scambio
router.post('/', async (req, res) => {
  try {
    const trade = await Trade.create(req.body);
    res.json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Lista di tutti gli scambi
router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 }).populate('user', 'username');
    res.json(trades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Lista di tutti gli scambi per un utente specifico
router.get('/user/:userId', async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username');
    res.json(trades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Recupera uno scambio specifico per ID
router.get('/:id', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id).populate('user', 'username');
    if (!trade) {
      return res.status(404).json({ message: 'Scambio non trovato' });
    }
    res.json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;