"use client";
import { Book } from '@/types'
import Link from 'next/link';
import React from 'react'

const Book = ({ book }: { book: Book }) => {
  return (
    <Link href={`/books/${book.id}`} className='cursor-pointer w-full lg:w-[128px] lg:min-h-[194px] flex flex-col items-center gap-2'>
      {
        book?.cover_image
          ?
          <img className='rounded w-[128px] h-[194px]' src={book.cover_image} alt="cover image of book" />
          :
          <div className='rounded w-[128px] h-[194px] border border-gray-500 flex justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white'>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{book.book_title}</h3>
              <p className="text-sm">{book.author_full_name}</p>
            </div>
          </div>
      }

      <p className='text-gray-500'>{book.author_full_name}</p>
      <p className='text-lg'>{book.book_title}</p>
      {book.available ? <p className='mt-4 text-green-500'>Dostupno</p> : <p className='mt-4 text-red-500'>Nedostupno</p>}

    </Link>
  )
}

const BooksPreview = ({ books }: { books: Book[] }) => {
  return (
    <div className='book-grid w-full overflow-x-hidden'>
      {
        books.map((book) => <Book book={book} />)
      }
    </div>
  )
}



export default BooksPreview