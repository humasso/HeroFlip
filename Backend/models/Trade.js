const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  heroId: String,
  name: String,
  image: String,
  quantity: { type: Number, default: 1 }
}, { _id: false });

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  description: String,
  offerCards: [cardSchema],
  wantCards: [cardSchema],
  creditsOffered: { type: Number, default: 0 },
  creditsWanted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);