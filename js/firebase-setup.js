import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJMIR_U9tEfTo9YC9x625tjrHWlznadgo",
  authDomain: "tcsnqt-9f73e.firebaseapp.com",
  projectId: "tcsnqt-9f73e",
  storageBucket: "tcsnqt-9f73e.firebasestorage.app",
  messagingSenderId: "600062350086",
  appId: "1:600062350086:web:d6a975d63f126aaf8a8487",
  measurementId: "G-8MRKXV1395"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

window.FirebaseAuth = auth;
window.FirebaseProvider = provider;
window.FirebaseSignInWithPopup = signInWithPopup;
window.FirebaseOnAuthStateChanged = onAuthStateChanged;
window.FirebaseSignOut = signOut;

window.FirebaseDB = db;
window.FirebaseFirestore = {
  doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy
};
