const express = require('express');
const Trade = require('../models/Trade');
const User = require('../models/User');
const Album = require('../models/Album');
const Notification = require('../models/Notification');
const router = express.Router();

async function getOrCreateAlbum(userId) {
  let album = await Album.findOne({ user: userId });
  if (!album) {
    album = new Album({ user: userId, cards: [] });
  }
  return album;
}

function moveCards(fromAlbum, toAlbum, cards) {
  for (const c of cards) {
    const qty = c.quantity || 1;
    const from = fromAlbum.cards.find(card => card.heroId === c.heroId);
    if (from && from.quantity >= qty) {
      from.quantity -= qty;
      if (from.quantity === 0) {
        fromAlbum.cards = fromAlbum.cards.filter(card => card.heroId !== c.heroId);
      }
      let to = toAlbum.cards.find(card => card.heroId === c.heroId);
      if (to) {
        to.quantity += qty;
      } else {
        toAlbum.cards.push({ heroId: c.heroId, name: c.name, image: c.image, quantity: qty });
      }
    }
  }
}

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
    await Notification.create({
      user: proposal.user,
      message: 'La tua proposta è stata rifiutata.'
    });
    const populated = await trade.populate('proposals.user', 'username');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Accetta una proposta e trasferisce carte e crediti
router.patch('/:tradeId/proposal/:proposalId/accept', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.tradeId);
    if (!trade) {
      return res.status(404).json({ message: 'Scambio non trovato' });
    }
    const proposal = trade.proposals.id(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposta non trovata' });
    }
    if (proposal.status !== 'pending') {
      return res.status(400).json({ message: 'Proposta già gestita' });
    }

    const owner = await User.findById(trade.user);
    const proposer = await User.findById(proposal.user);
    if (!owner || !proposer) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const ownerAlbum = await getOrCreateAlbum(owner._id);
    const proposerAlbum = await getOrCreateAlbum(proposer._id);

    moveCards(ownerAlbum, proposerAlbum, trade.offerCards);
    moveCards(proposerAlbum, ownerAlbum, proposal.offerCards);

    owner.credits += proposal.creditsOffered - trade.creditsOffered;
    proposer.credits += trade.creditsOffered - proposal.creditsOffered;

    await ownerAlbum.save();
    await proposerAlbum.save();
    await owner.save();
    await proposer.save();

    proposal.status = 'accepted';
    trade.proposals.forEach(p => {
      if (p._id.toString() !== proposal._id.toString()) {
        p.status = 'rejected';
      }
    });
    await trade.save();

    await Notification.create({
      user: proposal.user,
      message: 'La tua proposta è stata accettata.'
    });

    const populated = await trade.populate('proposals.user', 'username');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// Elimina uno scambio
router.delete('/:id', async (req, res) => {
  try {
    const trade = await Trade.findByIdAndDelete(req.params.id);
    if (!trade) {
      return res.status(404).json({ message: 'Scambio non trovato' });
    }
    res.json({ message: 'Annuncio eliminato' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;