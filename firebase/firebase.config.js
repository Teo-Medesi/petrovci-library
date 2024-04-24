// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/"
import dotenv from "dotenv"

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "petrovci-library.firebaseapp.com",
  projectId: "petrovci-library",
  storageBucket: "petrovci-library.appspot.com",
  messagingSenderId: "515915234034",
  appId: "1:515915234034:web:8694a6911fc18ac28dee6b",
  measurementId: "G-QM6CHRFHR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);