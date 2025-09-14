import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import Book from '../models/Book.js';

dotenv.config();

const MONGO_URI = process.env.CONNECTION_URI;

async function confirmPrompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase());
        });
    });
}

async function run() {
    try {
        if (!MONGO_URI) {
            console.error('CONNECTION_URI missing in .env');
            process.exit(1);
        }

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB:', mongoose.connection.name);

        const answer = await confirmPrompt(
            `⚠️  Are you sure you want to delete ALL books in the "${mongoose.connection.name}" database? (yes/no): `
        );

        if (answer !== 'yes') {
            console.log('Aborted. No documents deleted.');
            await mongoose.disconnect();
            process.exit(0);
        }

        const result = await Book.deleteMany({});
        console.log(
            `Deleted ${result.deletedCount} book(s) from "${mongoose.connection.name}".`
        );
    } catch (error) {
        console.error('Error deleting books:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();

//to delete all books in database run bash: node scripts/deleteBooks.js
