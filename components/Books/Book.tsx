import { db } from '@/firebase/firebase.config';
import { Book, BookExtended } from '@/types'
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Loading from '../Loading';

const Book = ({bookId}: {bookId: string}) => {
    const [book, setBook] = useState<Book | null>(null);
    const [bookExtended, setBookExtended] = useState<BookExtended | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    useEffect(() => {
        if (!book) getBook();
    }, [])
    
    const getBook = async () => {
        const docRef = doc(db, `books/${bookId}`);
        const docSnapshot = await getDoc(docRef);
        
        const book = docSnapshot.data() as Book;
        setBook(book);
        
        if (book) {
            const requestUrl = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${book.author_full_name}+intitle:${book.book_title}`;
            const response = await fetch(requestUrl);
            const data = await response.json(); 

            const bookExtended = data.items[0] as BookExtended;
            setBookExtended(bookExtended);
        }

        setIsLoading(false);
    }

    if (isLoading) return <Loading />
  else if (book) return (
    <div>Book</div>
  )
}

export default Book