// frontend/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBoKhFlywPjbmc4fHFHs--suGNJakcJSyQ",
    authDomain: "attendease5426.firebaseapp.com",
    projectId: "attendease5426",
    storageBucket: "attendease5426.firebasestorage.app",
    messagingSenderId: "807870242738",
    appId: "1:807870242738:web:8bd60838cae2a9e1644eab",
    measurementId: "G-C1H42N9CXE"
  };


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);