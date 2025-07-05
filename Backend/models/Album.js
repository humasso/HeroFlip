const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, unique: true },
  cards: [{
    heroId: String,
    name: String,
    image: String,
    quantity: { type: Number, default: 1 }
  }]
});

module.exports = mongoose.model('Album', albumSchema);