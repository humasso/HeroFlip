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
    const trades = await Trade.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate('proposals.user', 'username');
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
      .populate('user', 'username')
      .populate('proposals.user', 'username');
    res.json(trades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Recupera uno scambio specifico per ID
router.get('/:id', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id)
      .populate('user', 'username')
      .populate('proposals.user', 'username');
    if (!trade) {
      return res.status(404).json({ message: 'Scambio non trovato' });
    }
    res.json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Aggiungi una proposta a uno scambio
router.post('/:id/respond', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ message: 'Scambio non trovato' });
    }
    const exists = trade.proposals.find(p =>
      p.user.toString() === req.body.user && p.status === 'pending'
    );
    if (exists) {
      return res.status(400).json({ message: 'Proposta già inviata' });
    }
    trade.proposals.push(req.body);
    await trade.save();
    const populated = await trade.populate('proposals.user', 'username');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Rifiuta una proposta
router.patch('/:tradeId/proposal/:proposalId/reject', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.tradeId);
    if (!trade) {
      return res.status(404).json({ message: 'Scambio non trovato' });
    }
    const proposal = trade.proposals.id(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposta non trovata' });
    }
    proposal.status = 'rejected';
    await trade.save();
    const populated = await trade.populate('proposals.user', 'username');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;