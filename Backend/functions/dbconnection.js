const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {dbName: 'HeroFlip'});
    console.log('✅ Connesso a MongoDB');
  } catch (err) {
    console.error('❌ Errore connessione MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
