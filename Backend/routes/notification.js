const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Gestione notifiche utente
 */


/**
 * @swagger
 * /notification/{userId}:
 *   get:
 *     summary: Ottiene le notifiche di un utente
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista notifiche
 */
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Crea una notifica
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Notifica creata
 */
router.post('/', async (req, res) => {
  try {
    const not = await Notification.create(req.body);
    res.json(not);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;