import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/Book.js";

dotenv.config();

const uri = process.env.CONNECTION_URI;

if (!uri) {
  console.error("CONNECTION_URI is not defined in .env file");
  process.exit(1);
}

async function countBooks() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const totalBooks = await Book.countDocuments();
    console.log(`📚 Total books in collection: ${totalBooks}`);

    const sampleBooks = await Book.find().limit(5);
    console.log("📖 Sample books:");
    sampleBooks.forEach((b, i) => {
      console.log(`${i + 1}. ${b.title} by ${b.author}`);
    });

    await mongoose.connection.close();
    console.log(" MongoDB connection closed");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

countBooks();


//to count all books in database run bash: node scripts/countBooks.js