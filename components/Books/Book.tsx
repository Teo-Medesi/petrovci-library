"use client";

import { db } from '@/firebase/firebase.config';
import { Book, BookExtended } from '@/types'
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Loading from '../Loading';

const Book = ({ bookId }: { bookId: string }) => {
    const [book, setBook] = useState<Book | null>(null);
    const [bookRaw, setBookRaw] = useState<BookExtended | null>(null);
    const [bookExtended, setBookExtended] = useState<BookExtended | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [coverImage, setCoverImage] = useState<string>("");

    useEffect(() => {
        if (!book) getBook();
    }, [])

    const getBook = async () => {
        const docRef = doc(db, `books/${bookId}`);
        const docSnapshot = await getDoc(docRef);

        // get book info stored in firebase, very raw information like book title, author, and language
        const book = docSnapshot.data() as Book;
        if (book) await getBookExtended(book);

        setBook(book);
        setIsLoading(false);
    }

    const getBookExtended = async (book: Book) => {
        const requestUrl = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${book.author_full_name}+intitle:${book.book_title}`;
        const response = await fetch(requestUrl);
        const data = await response.json();

        // find at least one match for book in google books volumes
        if (data.items && data.items.length > 0) {

            // get extended book information using specific id, using only queries returns less properties and worse cover images than searching for one volume specifically
            const bookId = data.items[0]?.id;

            const extendedRequestUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
            const extendedResponse = await fetch(extendedRequestUrl);

            // doesn't return items array like query, but instead the object directly
            const bookExtended = await extendedResponse.json() as BookExtended;

            const bookIds = data.items.map((item: any) => item?.id);
            await getCoverImage(bookIds);

            setBookExtended(bookExtended);
            console.log("book extended", bookExtended)
        }

    }

    const getCoverImage = async (bookIds: string[]) => {
        for (const id of bookIds) {
            const requestUrl = `https://www.googleapis.com/books/v1/volumes/${id}`;
            const response = await fetch(requestUrl);
            const bookItem = await response.json() as BookExtended;

            const imageLinks = bookItem.volumeInfo?.imageLinks;
            if (imageLinks?.extraLarge) {
                setCoverImage(imageLinks.extraLarge);
                break; // Stop once a cover image is found
            }
    
        }
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
    else if (book && bookExtended) {
        return (
            <div className='p-5 min-h-screen flex flex-col items-center'>

                <div className='mb-8 aspect-2/3 w-full rounded flex justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white'>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{book.book_title}</h3>
                        <p className="text-sm">{book.author_full_name}</p>
                    </div>
                </div>
                <p className="text-sm">{book.author_full_name}</p>
                <h1 className='text-4xl mb-8'>{book.book_title}</h1>
                <p className='mb-4 text-gray-500 line-clamp-6'>{bookExtended.volumeInfo?.description}</p>

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