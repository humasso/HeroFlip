const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const shopRoutes = require('./routes/shop');
const albumRoutes = require('./routes/album');
const heroRoutes = require('./routes/hero');
const tradeRoutes = require('./routes/trade');
const notificationRoutes = require('./routes/notification');
const session = require('express-session');
const requireLogin = require('./middleware/sessionAuth');

const setupSwagger = require('./swagger');


const cors = require('cors');
require('dotenv').config();
const connectDB = require('./functions/dbconnection');

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false
  })
);

connectDB();

app.get('/', (req, res) => {
  res.send('<h1>Funziona il server</h1>');
});

// Rotte di auth sotto /api/auth
app.use('/auth', authRoutes);

// Da qui in poi richiede l'autenticazione
app.use(requireLogin);

// Rotte di user sotto /api/users
app.use('/user', userRoutes);

// Rotte per lo shop
app.use('/shop', shopRoutes);

// Rotte per l'album
app.use('/album', albumRoutes);

// Rotte per apertura pacchetti e gestione eroi
app.use('/hero', heroRoutes);

// Rotte per gli scambi
app.use('/trade', tradeRoutes);

// Rotte per le notifiche
app.use('/notification', notificationRoutes);

// Configurazione Swagger
setupSwagger(app); 


// Avvio del server
//const PORT = process.env.PORT || 4000;
const PORT = 3000
app.listen(PORT, () => console.log(`🚀 Server in ascolto su http://localhost:${PORT}`));
