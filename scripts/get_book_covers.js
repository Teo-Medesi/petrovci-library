import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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
const db = getFirestore(app);


async function updateBooks() {
    try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        querySnapshot.forEach(async (docSnapshot) => {

            const book = docSnapshot.data();

            if (!book.cover_image) {
                const request_url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${book.author_full_name}+intitle:${book.book_title}`;
                const response = await fetch(request_url);
                const data = await response.json();

                let cover_image = "";
                // Check all books in the items array for a cover image
                if (data.items) {
                    for (const bookItem of data.items) {
                        const imageLinks = bookItem.volumeInfo?.imageLinks;
                        if (imageLinks?.thumbnail) {
                            cover_image = imageLinks.thumbnail;
                            break; // Stop once a cover image is found
                        }
                    }
                }
                const docRef = doc(db, 'books', docSnapshot.id);
                await updateDoc(docRef, { cover_image });
                
                console.log(`Updated cover image for book ${docSnapshot.id}`);
            } else {
                console.log(`Book ${docSnapshot.id} already has a cover image`);
            }
        });
    } catch (error) {
        console.error('Error updating books:', error);
    }
}

updateBooks();
