// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyBfm1H_JO0U9S6pet8D5wyJxbdyjbakeek",
  authDomain: "help-yaar.firebaseapp.com",
  projectId: "help-yaar",
  storageBucket: "help-yaar.firebasestorage.app",
  messagingSenderId: "297669753307",
  appId: "1:297669753307:web:55e742c109d5b83dd48ffe",
  measurementId: "G-R67R8RZT7L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); 