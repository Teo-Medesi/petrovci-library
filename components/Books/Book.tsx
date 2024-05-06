"use client";

import { db } from '@/firebase/firebase.config';
import { Book, BookExtended } from '@/types'
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Loading from '../Loading';

const Book = ({ bookId }: { bookId: string }) => {
    const [book, setBook] = useState<Book | null>(null);
    const [bookExtended, setBookExtended] = useState<BookExtended | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [coverImage, setCoverImage] = useState<string>("");

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

            if (data.items && data.items.length > 0) {

                // get cover image
                for (const bookItem of data.items) {
                    const imageLinks = bookItem.volumeInfo?.imageLinks;
                    if (imageLinks?.thumbnail) {
                        setCoverImage(imageLinks.thumbnail)
                        break; // Stop once a cover image is found
                    }
                }

                const bookExtendedData = data.items[0] as BookExtended;
                setBookExtended(bookExtendedData);
                console.log("book extended", bookExtendedData)
            }
        }

        setIsLoading(false);
    }

    if (isLoading) return <Loading />
    else if (book && bookExtended && coverImage) {
        return (
            <div className='p-5 min-h-screen flex flex-col items-center'>

                <img className='mb-8 aspect-2/3 w-full rounded' src={coverImage} alt="cover image of book" />


                <p className="text-sm">{book.author_full_name}</p>
                <h1 className='text-4xl mb-8'>{book.book_title}</h1>
                <p className='mb-4 text-gray-500 line-clamp-6'>{bookExtended.volumeInfo?.description}</p>
            </div>
        )
    }
    else if (book) {
        return (
            <div className='p-5 min-h-screen'>

                <div className='aspect-2/3 w-full rounded flex justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white'>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{book.book_title}</h3>
                        <p className="text-sm">{book.author_full_name}</p>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>Book Not Found</div>
        )
    }
}

export default Book