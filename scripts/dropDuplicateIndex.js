import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';

dotenv.config();

async function dropDuplicateIndex() {
    if (!process.env.CONNECTION_URI) {
        console.error('CONNECTION_URI is missing in .env');
        process.exit(1);
    }

    await mongoose.connect(process.env.CONNECTION_URI);
    const indexes = await Book.collection.indexes();
    console.log('Current indexes:', indexes);

    const duplicateIndex = indexes.find((idx) => idx.name === 'google_id_1');
    if (duplicateIndex) {
        console.log('Dropping duplicate index:', duplicateIndex.name);
        await Book.collection.dropIndex(duplicateIndex.name);
        console.log('Duplicate index dropped successfully.');
    } else {
        console.log('No duplicate google_id index found.');
    }

    await mongoose.disconnect();
}

dropDuplicateIndex().catch((err) => {
    console.error('Error dropping index:', err);
    process.exit(1);
});


//node scripts/dropDuplicateIndex.js