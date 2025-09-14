import mongoose from 'mongoose';
import axios from 'axios';
import Book from '../models/Book.js';
import dotenv from 'dotenv';
dotenv.config();

async function fetchAndStoreBooks() {
    await mongoose.connect(process.env.CONNECTION_URI);

    try {
        // Loop over multiple pages of Google Books API
        for (let startIndex = 0; startIndex < 200; startIndex += 40) {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=harry+potter&maxResults=40&startIndex=${startIndex}`
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
                    },
                    { upsert: true }
                );
            }

            console.log(`✅ Inserted batch starting at index ${startIndex}`);
        }

        console.log('✅ All books inserted successfully!');
    } catch (err) {
        console.error('Error fetching books:', err.message);
    } finally {
        mongoose.connection.close();
    }
}

fetchAndStoreBooks();


//to fetch all books in database run bash: node scripts/fetchBooks.js