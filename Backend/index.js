const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./functions/dbconnection');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('<h1>Hello, Express.js Server!</h1>');
});

// Monta le rotte di auth sotto /api/auth
app.use('/auth', authRoutes);

// Monta le rotte di user sotto /api/users
app.use('/user', userRoutes);

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server in ascolto su http://localhost:${PORT}`));
