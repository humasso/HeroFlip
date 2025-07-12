const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const Album = require('../models/Album');
const Notification = require('../models/Notification');
const Trade = require('../models/Trade');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gestione utenti
 */


/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Ottiene le informazioni di un utente
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dati dell'utente
 *       404:
 *         description: Utente non trovato
 */
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID non valido' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /user/pass/{id}:
 *   put:
 *     summary: Aggiorna la password di un utente
 *     tags: [User]
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
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password aggiornata
 *       404:
 *         description: Utente non trovato
 */
router.put('/pass/:id', async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID non valido' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Dati mancanti' });
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ message: 'Password errata' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password aggiornata' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /user/username/{id}:
 *   put:
 *     summary: Aggiorna lo username
 *     tags: [User]
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
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username aggiornato
 *       404:
 *         description: Utente non trovato
 */
router.put('/username/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID non valido' });
    }

    const { username } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { username }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /user/favoritehero/{id}:
 *   put:
 *     summary: Aggiorna l'eroe preferito
 *     tags: [User]
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
 *               favoriteHero:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utente aggiornato
 *       404:
 *         description: Utente non trovato
 */
router.put('/favoritehero/:id', async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID non valido' });
    }

    const { favoriteHero } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { favoriteHero }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /user/avatar/{id}:
 *   put:
 *     summary: Aggiorna l'avatar dell'utente
 *     tags: [User]
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
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utente aggiornato
 *       404:
 *         description: Utente non trovato
 */
router.put('/avatar/:id', async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID non valido' });
    }

    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { avatar }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Elimina un utente e tutti i dati associati
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utente eliminato
 *       404:
 *         description: Utente non trovato
 */
router.delete('/:id', async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID non valido' });
    }

    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Utente non trovato' });

    await Promise.all([
      Album.deleteOne({ user: req.params.id }),
      Notification.deleteMany({ $or: [{ user: req.params.id }, { actor: req.params.id }] }),
      Trade.deleteMany({ $or: [{ user: req.params.id }, { 'proposals.user': req.params.id }] })
    ]);

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;
