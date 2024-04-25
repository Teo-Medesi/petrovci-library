#!/usr/bin/env node
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, where, query, getDocs } from 'firebase/firestore/lite';
import fs from 'fs/promises';
import yargs from 'yargs';


// Parse command-line arguments
const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --filepath [filepath]')
  .demandOption(['filepath'])
  .argv;

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

// Read JSON file
const filePath = argv.filepath;

// Upload data to Firestore
async function uploadToFirestore(data) {
  for (const book of data) {
    // Ensure the required properties are present
    if (book.author_last_name && book.book_title) {
      // Check for duplicate
      const q = query(collection(db, 'books'), where('author_last_name', '==', book.author_last_name), where('book_title', '==', book.book_title));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Add book to Firestore
        await addDoc(collection(db, 'books'), book);
        console.log(`Added book: ${book.book_title} by ${book.author_full_name}`);
      } else {
        console.log(`Skipping duplicate: ${book.book_title} by ${book.author_full_name}`);
      }
    } else {
      console.log(`Skipping book with missing properties: ${JSON.stringify(book)}`);
    }
  }
}

// Main function
async function main() {
  try {
    const jsonData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    await uploadToFirestore(jsonData);
    console.log('Data uploaded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading data:', error);
    process.exit(1);
  }
}

// Run main function
main();
