// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./attendeese-app-firebase-adminsdk-fbsvc-49471860a0.json'); 
// ↓ download this JSON from your Firebase Console → Project Settings → Service accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
