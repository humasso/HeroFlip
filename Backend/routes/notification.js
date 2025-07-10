const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

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