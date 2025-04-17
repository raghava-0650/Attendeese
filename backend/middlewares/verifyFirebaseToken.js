// middleware/verifyFirebaseToken.js
const admin = require('../firebaseAdmin');

module.exports = async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // decodedToken contains { uid, email, ... }
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Firebase token verification failed:', err);
    return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
  }
};
