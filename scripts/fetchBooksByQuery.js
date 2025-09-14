import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Book from '../models/Book.js';

dotenv.config();

const uri = process.env.CONNECTION_URI;
const totalResults = parseInt(process.env.TOTAL_RESULTS, 10) || 120;

async function fetchAndStoreBooks(query) {
    await mongoose.connect(uri);
    try {
        for (let startIndex = 0; startIndex < totalResults; startIndex += 40) {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&startIndex=${startIndex}`
            );
            const books = response.data.items || [];

            for (const book of books) {
                const info = book.volumeInfo;
                const isbn =
                    info.industryIdentifiers?.find(
                        (id) => id.type === 'ISBN_13'
                    )?.identifier ||
                    info.industryIdentifiers?.[0]?.identifier ||
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
                        category: query.replace(/\+/g, " "), // <-- assign category based on query
                    },
                    { upsert: true }
                );
            }

            console.log(
                `Fetched ${books.length} books for "${query}" (startIndex: ${startIndex})`
            );
        }
        console.log('✅ Books inserted successfully!');
    } catch (err) {
        console.error('Error fetching books:', err.message);
    } finally {
        mongoose.connection.close();
    }
}

const query = process.argv[2] || process.env.BOOK_QUERY || 'harry+potter';
fetchAndStoreBooks(query);

// from .env
// node scripts/fetchBooksByQuery.js

// powershell
// node scripts/fetchBooksByQuery.js "lord+of+the+rings"

// or

// powershell
// node scripts/fetchBooksByQuery.js "data+science"