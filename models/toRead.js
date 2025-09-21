import mongoose from 'mongoose';

const toReadSchema = new mongoose.Schema(
    {
        google_id: { type: String, unique: true, required: true },
        title: { type: String, required: true },
        author: String,
        publisher: String,
        published_date: String,
        description: String,
        thumbnail_url: String,
        isbn: String,
        category: String,
        webReaderLink: String,
        pdfLink: String,
        epubLink: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

const ToRead = mongoose.model('ToRead', toReadSchema);
export default ToRead;
