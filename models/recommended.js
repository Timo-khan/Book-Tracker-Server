import mongoose from 'mongoose';

const recommendedSchema = new mongoose.Schema(
    {
        google_id: { type: String, required: true }, // ID from Google Books API
        title: { type: String, required: true },
        author: String,
        thumbnail_url: String,
        publisher: String,
        published_date: String,
        description: String,
        isbn: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        } // who recommended it
    },
    { timestamps: true }
);

const Recommended = mongoose.model('Recommended', recommendedSchema);
export default Recommended;
