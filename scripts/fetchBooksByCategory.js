import mongoose from 'mongoose';
import axios from 'axios';
import Book from '../models/Book.js';
import dotenv from 'dotenv';
dotenv.config();

const CONNECTION_URI = process.env.CONNECTION_URI;

// Categories and queries
const categories = [
    { name: 'Harry Potter', query: 'harry+potter' },
    { name: 'Lord of the Rings', query: 'lord+of+the+rings' },
    { name: 'Game of Thrones', query: 'game+of+thrones' }
];

const TOTAL_RESULTS = 120; // total books per category
const MAX_RESULTS_PER_REQUEST = 40; // Google Books API max per request

async function fetchAndStoreBooks(query, category) {
    try {
        for (
            let startIndex = 0;
            startIndex < TOTAL_RESULTS;
            startIndex += MAX_RESULTS_PER_REQUEST
        ) {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${MAX_RESULTS_PER_REQUEST}&startIndex=${startIndex}`
            );

            const books = response.data.items || [];

            for (const book of books) {
                const info = book.volumeInfo;

                const isbn =
                    (info.industryIdentifiers &&
                        info.industryIdentifiers.find(
                            (id) => id.type === 'ISBN_13'
                        )?.identifier) ||
                    (info.industryIdentifiers &&
                        info.industryIdentifiers[0]?.identifier) ||
                    null;

                await Book.updateOne(
                    { google_id: book.id },
                    {
                        google_id: book.id,
                        title: info.title || 'Untitled',
                        author: info.authors
                            ? info.authors.join(', ')
                            : 'Unknown',
                        publisher: info.publisher || null,
                        published_date: info.publishedDate || null,
                        description: info.description || null,
                        thumbnail_url: info.imageLinks?.thumbnail || null,
                        isbn,
                        category // assign category
                    },
                    { upsert: true }
                );
            }

            console.log(
                `Fetched ${books.length} books for "${category}" (startIndex: ${startIndex})`
            );
        }

        console.log(
            `✅ All books for category "${category}" inserted successfully!`
        );
    } catch (err) {
        console.error(
            `Error fetching books for category "${category}":`,
            err.message
        );
    }
}

async function main() {
    await mongoose.connect(CONNECTION_URI);
    console.log('Connected to MongoDB');

    for (const cat of categories) {
        await fetchAndStoreBooks(cat.query, cat.name);
    }

    mongoose.connection.close();
    console.log('MongoDB connection closed');
}

main();


//node scripts/fetchBooksByCategory.js