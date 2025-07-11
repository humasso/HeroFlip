const express = require('express');
const User = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Operazioni di acquisto e crediti
 */


/**
 * @swagger
 * /shop/credits/{id}:
 *   post:
 *     summary: Aggiunge crediti a un utente
 *     tags: [Shop]
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
 *             properties:
 *               credits:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Crediti aggiunti
 *       404:
 *         description: Utente non trovato
 */
router.post('/credits/:id', async (req, res) => {
  try {
    const credits = parseInt(req.body.credits, 10);
    if (!credits || credits <= 0) {
      return res.status(400).json({ message: 'Crediti non validi' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { credits } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    console.log(`Crediti aggiunti: ${credits} a ${user.username}`);
    res.json({ message: 'Crediti aggiunti', credits: user.credits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

//post aparte per l'apertura dei pacchetti

/**
 * @swagger
 * /shop/packs/{id}:
 *   post:
 *     summary: Acquista pacchetti per l'utente specificato
 *     tags: [Shop]
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
 *             properties:
 *               packType:
 *                 type: string
 *               qty:
 *                 type: integer
 *               cost:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pacchetti acquistati
 *       404:
 *         description: Utente non trovato
 */
router.post('/packs/:id', async (req, res) => {
  try {
    const { packType, qty, cost } = req.body;
    const quantity = parseInt(qty, 10);
    const totalCost = parseInt(cost, 10);

    if (!packType || !quantity || quantity <= 0 || !totalCost || totalCost <= 0) {
      return res.status(400).json({ message: 'Dati non validi' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    if (user.credits < totalCost) {
      return res.status(400).json({ message: 'Crediti insufficienti' });
    }

    user.credits -= totalCost;

    const pack = user.packs.find(p => p.packType === packType);
    if (pack) {
      pack.quantity += quantity;
    } else {
      user.packs.push({ packType, quantity });
    }

    await user.save();

    res.json({ message: 'Pacchetti acquistati', credits: user.credits, packs: user.packs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /shop/open/{id}:
 *   post:
 *     summary: Apre pacchetti per un utente
 *     tags: [Shop]
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
 *             properties:
 *               packType:
 *                 type: string
 *               qty:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pacchetti aperti
 *       404:
 *         description: Utente non trovato
 */
router.post('/open/:id', async (req, res) => {
  try {
    const { packType, qty } = req.body;
    const quantity = parseInt(qty, 10);
    if (!packType || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Dati non validi' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const pack = user.packs.find(p => p.packType === packType);
    if (!pack || pack.quantity < quantity) {
      return res.status(400).json({ message: 'Pacchetti insufficienti' });
    }

    pack.quantity -= quantity;
    await user.save();

    res.json({ message: 'Pacchetti aperti', packs: user.packs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;