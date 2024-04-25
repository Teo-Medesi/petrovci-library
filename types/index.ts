interface Book {
    cover_image?: string,
    id?: string,
    author_first_name: string,
    author_last_name: string,
    author_full_name: string,
    available: boolean,
    book_language: string,
    book_title: string,
    number_of_copies: number

}

export type {
    Book
}