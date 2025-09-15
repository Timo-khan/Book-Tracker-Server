import mongoose from "mongoose";

const toReadSchema = new mongoose.Schema(
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

toReadSchema.index({ category: 1 });

const ToRead = mongoose.model('ToRead', toReadSchema);
export default ToRead;