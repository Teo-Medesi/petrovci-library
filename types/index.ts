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

interface BookExtended {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: {
        title: string;
        authors: string[];
        publisher?: string;
        publishedDate?: string;
        description?: string;
        industryIdentifiers: {
            type: string;
            identifier: string;
        }[];
        readingModes: {
            text: boolean;
            image: boolean;
        };
        pageCount?: number;
        printType: string;
        maturityRating: string;
        allowAnonLogging: boolean;
        contentVersion: string;
        panelizationSummary?: {
            containsEpubBubbles: boolean;
            containsImageBubbles: boolean;
        };
        imageLinks: {
            smallThumbnail: string;
            thumbnail: string;
        };
        language: string;
        previewLink: string;
        infoLink: string;
        canonicalVolumeLink: string;
    };
    saleInfo: {
        country: string;
        saleability: string;
        isEbook: boolean;
    };
    accessInfo: {
        country: string;
        viewability: string;
        embeddable: boolean;
        publicDomain: boolean;
        textToSpeechPermission: string;
        epub?: {
            isAvailable: boolean;
            acsTokenLink: string;
        };
        pdf?: {
            isAvailable: boolean;
            acsTokenLink: string;
        };
        webReaderLink: string;
        accessViewStatus: string;
        quoteSharingAllowed: boolean;
    };
    searchInfo?: {
        textSnippet: string;
    };
}

export type {
    Book,
    BookExtended
}