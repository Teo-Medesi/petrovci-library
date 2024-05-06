import Book from "@/components/Books/Book";

export default function BookPage({params}: {params: {bookId: string}}) {
    return <Book bookId={params.bookId}/>;
}