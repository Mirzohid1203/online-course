import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2Z9GPewb9VmcAgthh5Knk3xCf6NeHUb4",
  authDomain: "online-course-5a9c9.firebaseapp.com",
  projectId: "online-course-5a9c9",
  storageBucket: "online-course-5a9c9.firebasestorage.app",
  messagingSenderId: "846106584777",
  appId: "1:846106584777:web:56e89dcc99ee3448bfcf18"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
