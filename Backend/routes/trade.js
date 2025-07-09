const express = require('express');
const Trade = require('../models/Trade');
const User = require('../models/User');
const router = express.Router();

// Create new trade
router.post('/', async (req, res) => {
  try {
    const trade = await Trade.create(req.body);
    res.json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// List all trades
router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 }).populate('user', 'username');
    res.json(trades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Get single trade by id
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