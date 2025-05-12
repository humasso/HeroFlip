const jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Accesso negato. Nessun token fornito.' });
  }
  // Formato atteso: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token JWT mancante.' });
  }
  try {
    // Verifica il token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // attach payload utente (es. userId, email) alla richiesta
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido o scaduto.' });
  }
};