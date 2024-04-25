"use client";

import { useEffect, useState } from "react";
import Fuse from 'fuse.js';
import { collection, getDocs } from 'firebase/firestore';

import { Book } from "@/types/index.js";
import { db } from "@/firebase/firebase.config";

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [displayBooks, setDisplayBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllBooks();
  }, []);

  const getAllBooks = async () => {
    try {
      const booksCollection = collection(db, 'books');
      const querySnapshot = await getDocs(booksCollection);
      

      const booksData: any = [];

      querySnapshot.forEach((doc) => {
        booksData.push({ id: doc.id, ...doc.data() });
      });

      setBooks(booksData);
      setRandomDisplayBooks(booksData); // Set random display books initially
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const setRandomDisplayBooks = (booksData: Book[]) => {
    // Shuffle the books array
    const shuffledBooks = booksData.sort(() => Math.random() - 0.5);
    // Slice the first 100 books for display
    const randomBooks = shuffledBooks.slice(0, 100);
    setDisplayBooks(randomBooks);
  };

  const getBooksBySearch = () => {
    const fuse = new Fuse(books, {
      keys: ['author_full_name', 'author_last_name', 'book_title'],
      includeScore: true,
      threshold: 0.4,
      location: 0,
      
    });

    const results = fuse.search(search);
    const searchBooks = results.map((result) => result.item);
    const limitedBooks = searchBooks.slice(0, 100); // Limit to 100 results
    setDisplayBooks(limitedBooks);
  };

  useEffect(() => {
    getBooksBySearch();
  }, [search]);

  return (
    <div className='w-screen flex-col px-6 lg:p-0 min-h-screen flex items-center'>
      <h1 className='text-3xl mb-16 mt-60'>Upišite ime knjige ili autora</h1>
      <input
        onChange={(event) => setSearch(event.target.value)}
        type="text"
        className='input search-input pb-3 text-gray-700 w-full lg:w-1/3 box-content rounded-none border-b border-x-0 border-t-0 border-gray-500 text-xl text-center lg:text-2xl '
      />
      <div>
        <h2>Displaying <span className="uppercase">{displayBooks.length}</span> book(s)</h2>
        <ul>
          {displayBooks.map((book) => (
            <li className="text-black" key={book.id}>{book.book_title} by {book.author_full_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
