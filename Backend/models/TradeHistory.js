const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  heroId: String,
  name: String,
  image: String,
  quantity: { type: Number, default: 1 }
}, { _id: false });

const tradeHistorySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  proposer: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  description: String,
  offerCards: [cardSchema], // cards offered by owner
  wantCards: [cardSchema],
  creditsOffered: { type: Number, default: 0 },
  creditsWanted: { type: Number, default: 0 },
  proposerOfferCards: [cardSchema], // cards offered by proposer
  proposerCreditsOffered: { type: Number, default: 0 },
  createdAt: Date,
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TradeHistory', tradeHistorySchema);