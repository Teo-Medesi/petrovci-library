// fixBooks.js

import fs from 'fs/promises';
import yargs from 'yargs';

// Function to fix mistakes in books.json file
async function fixBooks(inputFilePath, outputFilePath) {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(await fs.readFile(inputFilePath, 'utf8'));
    
    let newBooks = [];
    
    // Iterate over each book object
    for (const book of jsonData) {
      // Ensure that the necessary properties exist
      if (!book.author_first_name || !book.author_last_name) {
        // Extract author first and last name from author full name
        const authorParts = book.author_full_name.split(' ');
        newBooks.push({...book, author_first_name: authorParts[0], author_last_name: authorParts.slice(1).join(' ') })
      }
      else {
        newBooks.push(book)
      }
    }
    
    // Write the updated JSON data to a new file
    await fs.writeFile(outputFilePath, JSON.stringify(newBooks, null, 2));
    
    console.log('New JSON file has been created with the fixed list of books.');
  } catch (error) {
    console.error('Error fixing books:', error);
  }
}

// Define command-line options
const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --input [inputFilePath] --output [outputFilePath]')
  .demandOption(['input', 'output'])
  .argv;

// Example usage:
const inputFilePath = argv.input;
const outputFilePath = argv.output;
fixBooks(inputFilePath, outputFilePath);
