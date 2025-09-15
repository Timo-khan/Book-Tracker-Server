import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        google_id: { type: String, unique: true, required: true },
        title: String,
        author: String,
        publisher: String,
        published_date: String,
        description: String,
        thumbnail_url: String,
        isbn: String,
        category: String,
        webReaderLink: String, 
        pdfLink: String,        
        epubLink: String 
    },
    { timestamps: true }
);

//indexes for faster category queries
bookSchema.index({ category: 1 });

export default mongoose.model('Book', bookSchema);
