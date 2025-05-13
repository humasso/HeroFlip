const express = require('express');
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./functions');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Hello, Express.js Server!</h1>');
});

// Monta le rotte di auth sotto /api/auth
app.use('/auth', authRoutes);

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server in ascolto su http://localhost:${PORT}`));
