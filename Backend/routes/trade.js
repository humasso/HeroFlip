const express = require('express');
const Trade = require('../models/Trade');
const User = require('../models/User');
const Album = require('../models/Album');
const Notification = require('../models/Notification');
const TradeHistory = require('../models/TradeHistory');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trade
 *   description: Gestione degli scambi
 */

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

/**
 * @swagger
 * /trade:
 *   post:
 *     summary: Crea un nuovo scambio e lo publica sulla bacheca
 *     tags: [Trade]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Scambio creato
 */
router.post('/', async (req, res) => {
  try {
    const { offerCards = [], creditsOffered = 0, creditsWanted = 0 } = req.body;

    if (offerCards.length === 0 && creditsOffered <= 0) {
      return res.status(400).json({
        message: 'Indica almeno una carta o dei crediti da offrire.'
      });
    }

    if (creditsWanted > 9999) {
      return res.status(400).json({
        message: 'Non puoi richiedere più di 9999 crediti.'
      });
    }

    const trade = await Trade.create(req.body);
    res.json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});


/**
 * @swagger
 * /trade:
 *   get:
 *     summary: Lista di tutti gli scambi
 *     tags: [Trade]
 *     responses:
 *       200:
 *         description: Elenco scambi
 */
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

/**
 * @swagger
 * /trade/user/{userId}:
 *   get:
 *     summary: Lista degli scambi creati da un utente specifico
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Elenco scambi
 */
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

/**
 * @swagger
 * /trade/history/{userId}:
 *   get:
 *     summary: Storico degli scambi completati di un utente
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Storico scambi
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await TradeHistory.find({
      $or: [
        { owner: req.params.userId },
        { proposer: req.params.userId }
      ]
    })
      .sort({ completedAt: -1 })
      .populate('owner', 'username')
      .populate('proposer', 'username');
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});


/**
 * @swagger
 * /trade/{id}:
 *   get:
 *     summary: Recupera informazioni di uno scambio tramite ID
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dati dello scambio
 *       404:
 *         description: Scambio non trovato
 */
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

/**
 * @swagger
 * /trade/{id}/respond:
 *   post:
 *     summary: Invia una proposta di scambio
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Proposta aggiunta
 *       404:
 *         description: Scambio non trovato
 */
router.post('/:id/respond', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ message: 'Scambio non trovato' });
    }
    if (trade.creditsWanted > 0 && req.body.creditsOffered !== trade.creditsWanted) {
      return res.status(400).json({ message: 'Numero di crediti offerti non valido' });
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

/**
 * @swagger
 * /trade/{tradeId}/proposal/{proposalId}/reject:
 *   patch:
 *     summary: Rifiuta una proposta
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proposta rifiutata
 *       404:
 *         description: Scambio o proposta non trovati
 */
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
      actor: trade.user,
      message: 'La tua proposta è stata rifiutata.'
    });
    const populated = await trade.populate('proposals.user', 'username');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /trade/{tradeId}/proposal/{proposalId}/accept:
 *   patch:
 *     summary: Accetta una proposta e trasferisce carte e crediti
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proposta accettata
 *       404:
 *         description: Scambio o proposta non trovati
 */
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

    await TradeHistory.create({
      owner: trade.user,
      proposer: proposal.user,
      description: trade.description,
      offerCards: trade.offerCards,
      wantCards: trade.wantCards,
      creditsOffered: trade.creditsOffered,
      creditsWanted: trade.creditsWanted,
      proposerOfferCards: proposal.offerCards,
      proposerCreditsOffered: proposal.creditsOffered,
      createdAt: trade.createdAt
    });

    await Notification.create({
      user: proposal.user,
      actor: trade.user,
      message: 'La tua proposta è stata accettata.'
    });

    const populated = await trade.populate('proposals.user', 'username');
    await Trade.findByIdAndDelete(trade._id);

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /trade/{id}:
 *   delete:
 *     summary: Elimina uno scambio
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scambio eliminato
 *       404:
 *         description: Scambio non trovato
 */
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