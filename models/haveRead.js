import mongoose from 'mongoose';

const haveReadSchema = new mongoose.Schema(
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

const HaveRead = mongoose.model('HaveRead', haveReadSchema);
export default HaveRead;
