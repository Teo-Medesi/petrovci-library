#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, where, query, getDocs } from 'firebase/firestore/lite';
import fs from 'fs/promises';
import yargs from 'yargs';

// Initialize Firebase App

const firebaseConfig = {
  // replace with your firebase configuration
};
const app = initializeApp(firebaseConfig);

// Get a reference to Firestore
const db = getFirestore(app);

// Parse command-line arguments
const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --filepath [filepath]')
  .demandOption(['filepath'])
  .argv;

// Read JSON file
const filePath = argv.filepath;

// Upload data to Firestore
async function uploadToFirestore(data) {
  for (const book of data) {
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
