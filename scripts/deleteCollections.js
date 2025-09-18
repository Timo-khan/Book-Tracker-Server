import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

import Favorite from '../models/favorite.js';
import ToRead from '../models/toRead.js';
import HaveRead from '../models/haveRead.js';

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
            `⚠️  Are you sure you want to delete ALL books from Favorites, To-Read, and Have-Read in "${mongoose.connection.name}"? (yes/no): `
        );

        if (answer !== 'yes') {
            console.log('Aborted. No documents deleted.');
            await mongoose.disconnect();
            process.exit(0);
        }

        // Delete from all collections
        const favResult = await Favorite.deleteMany({});
        const toReadResult = await ToRead.deleteMany({});
        const haveReadResult = await HaveRead.deleteMany({});

        console.log(`🗑️  Deleted ${favResult.deletedCount} favorite(s).`);
        console.log(
            `🗑️  Deleted ${toReadResult.deletedCount} to-read book(s).`
        );
        console.log(
            `🗑️  Deleted ${haveReadResult.deletedCount} have-read book(s).`
        );
    } catch (error) {
        console.error(' Error deleting:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();


//node scripts/deleteCollections.js