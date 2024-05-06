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
                const requestUrlCroatian = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${book.author_full_name}+intitle:${book.book_title}`;
                const responseCroatian = await fetch(requestUrlCroatian);
                const dataCroatian = await responseCroatian.json();

                let coverImage = "";

                // Check if Croatian cover image is available
                if (dataCroatian.items && dataCroatian.items.length > 0) {
                    for (const bookItem of dataCroatian.items) {
                        const imageLinks = bookItem.volumeInfo?.imageLinks;
                        if (imageLinks?.thumbnail) {
                            coverImage = imageLinks.thumbnail;
                            break; // Stop once a cover image is found
                        }
                    }
                } else {
                    // If no Croatian cover image found, search for English version
                    const requestUrlEnglish = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${book.author_full_name}+intitle:${book.book_title}&langRestrict=en`;
                    const responseEnglish = await fetch(requestUrlEnglish);
                    const dataEnglish = await responseEnglish.json();

                    if (dataEnglish.items && dataEnglish.items.length > 0) {
                        const imageLinks = dataEnglish.items[0].volumeInfo?.imageLinks;
                        if (imageLinks?.thumbnail) {
                            coverImage = imageLinks.thumbnail;
                        }
                    }
                }

                const docRef = doc(db, 'books', docSnapshot.id);
                await updateDoc(docRef, { cover_image: coverImage });
                
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
