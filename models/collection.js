import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bookId: {
            type: String, // Google Books ID
            required: true
        },
        collectionType: {
            type: String,
            enum: ['favorites', 'to-read', 'have-read'],
            required: true
        },
        // Cache book data for better performance
        bookData: {
            title: {
                type: String,
                required: true
            },
            authors: [{
                type: String
            }],
            thumbnail: {
                type: String
            },
            publishedDate: {
                type: String
            },
            description: {
                type: String
            },
            pageCount: {
                type: Number
            }
        }
    },
    { timestamps: true }
);

// Compound index to prevent duplicate books in same collection for same user
collectionSchema.index({ userId: 1, bookId: 1, collectionType: 1 }, { unique: true });

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;