// src/firebaseConfig.js

// 1. We import the functions we need from the Firebase library.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

// 2. THIS IS YOUR SECRET HANDSHAKE.
//    Copy the `firebaseConfig` object from the Firebase website and paste it here.
const firebaseConfig = {
  apiKey: "AIzaSyAKsUkPydEVgQwvulEL3iD4-Cs5UmGT70A",
  authDomain: "grabngoweb-87cf1.firebaseapp.com",
  projectId: "grabngoweb-87cf1",
  storageBucket: "grabngoweb-87cf1.firebasestorage.app",
  messagingSenderId: "442146232888",
  appId: "1:442146232888:web:a9ce5f4b8682018b88a4cd"
};

// 3. We initialize the connection to Firebase.
const app = initializeApp(firebaseConfig);

// 4. We get the specific services we need and export them
//    so other files in our app can use them.
export const auth = getAuth(app); // For handling user logins
export const googleProvider = new GoogleAuthProvider(); // For the "Sign in with Google" pop-up
export const db = getFirestore(app); // For connecting to our Firestore database
export const messaging = getMessaging(app); // For handling push notifications
