const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  heroId: String,
  name: String,
  image: String,
  quantity: { type: Number, default: 1 }
}, { _id: false });

const proposalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  offerCards: [cardSchema],
  creditsOffered: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});


const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  description: String,
  offerCards: [cardSchema],
  wantCards: [cardSchema],
  creditsOffered: { type: Number, default: 0 },
  creditsWanted: { type: Number, default: 0 },
  proposals: [proposalSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);