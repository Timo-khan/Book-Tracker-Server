import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
    {
        google_id: { type: String, unique: true, required: true },
        title: String,
        author: String,
        publisher: String,
        published_date: String,
        description: String,
        thumbnail_url: String,
        isbn: String,
        category: String
    },
    { timestamps: true }
);

favoriteSchema.index({ category: 1 });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
