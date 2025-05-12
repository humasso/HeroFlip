const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).end();
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, 'TUA_CHIAVE_SEGRETA');
    next();
  } catch {
    res.status(401).end();
  }
};
