const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email:    { type: String, unique: true, required: true },
  password: { type: String, required: true },
  favoriteHero: { type: String, required: true },
  credits: { type: Number, default: 0 },
  avatar: { type: String, default: 'https://i.pravatar.cc/300' }, // random avatar oppure foto profilo del eroe preferito
  //isAdmin: { type: Boolean, default: false }, ci penso cosi 
});
module.exports = mongoose.model('Users', userSchema);    