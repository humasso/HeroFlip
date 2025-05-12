const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => console.log('✅ Connesso a MongoDB'))
.catch(err => console.error('❌ Errore connessione MongoDB:', err));

// Monta le rotte di auth sotto /api/auth
app.use('/api/auth', authRoutes);

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server in ascolto su http://localhost:${PORT}`));
