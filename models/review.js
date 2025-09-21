import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        reviewText: {
            type: String,
            maxlength: 1000
        },
        // Cache book data
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
            }
        }
    },
    { timestamps: true }
);

// One review per user per book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;