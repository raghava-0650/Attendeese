// frontend/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDDQWg2ezULlkng02i8saaBOEkpSyNPhJ0",
    authDomain: "attendeese-app.firebaseapp.com",
    projectId: "attendeese-app",
    storageBucket: "attendeese-app.firebasestorage.app",
    messagingSenderId: "643706535780",
    appId: "1:643706535780:web:ce3106e6bffa74b6b64471",
    measurementId: "G-H1KMDYZX73"
  };


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);