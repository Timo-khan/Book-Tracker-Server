import jwt from 'jsonwebtoken';
import Review from '../models/review.js';
import User from '../models/user.js';

// Helper function to get user ID from token
const getUserIdFromToken = (req) => {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded.user._id;
};

const reviewControllers = {
    // Create or update review
    createOrUpdateReview: async (req, res) => {
        const { bookId, rating, reviewText, bookData } = req.body;

        try {
            const userId = getUserIdFromToken(req);

            // Validate rating
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ 
                    message: 'Rating must be between 1 and 5.' 
                });
            }

            // Check if required fields are provided
            if (!bookId || !bookData || !bookData.title) {
                return res.status(400).json({ 
                    message: 'Book ID and book data with title are required.' 
                });
            }

            // Check if user exists
            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Try to find existing review
            let existingReview = await Review.findOne({ userId, bookId });

            if (existingReview) {
                // Update existing review
                existingReview.rating = rating;
                existingReview.reviewText = reviewText || '';
                existingReview.bookData = {
                    title: bookData.title,
                    authors: bookData.authors || [],
                    thumbnail: bookData.thumbnail || null
                };
                
                await existingReview.save();

                res.status(200).json({
                    review: existingReview,
                    message: 'Review updated successfully!'
                });
            } else {
                // Create new review
                const newReview = new Review({
                    userId,
                    bookId,
                    rating,
                    reviewText: reviewText || '',
                    bookData: {
                        title: bookData.title,
                        authors: bookData.authors || [],
                        thumbnail: bookData.thumbnail || null
                    }
                });

                await newReview.save();

                res.status(201).json({
                    review: newReview,
                    message: 'Review created successfully!'
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Get user's reviews
    getUserReviews: async (req, res) => {
        try {
            const userId = getUserIdFromToken(req);

            const reviews = await Review.find({ userId }).sort({ createdAt: -1 });

            res.status(200).json({
                reviews,
                count: reviews.length,
                message: 'Reviews retrieved successfully!'
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Get review for specific book by user
    getReviewByBook: async (req, res) => {
        const { bookId } = req.params;

        try {
            const userId = getUserIdFromToken(req);

            const review = await Review.findOne({ userId, bookId });

            if (!review) {
                return res.status(404).json({ 
                    message: 'Review not found for this book.' 
                });
            }

            res.status(200).json({
                review,
                message: 'Review retrieved successfully!'
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Delete review
    deleteReview: async (req, res) => {
        const { bookId } = req.params;

        try {
            const userId = getUserIdFromToken(req);

            const deletedReview = await Review.findOneAndDelete({ userId, bookId });

            if (!deletedReview) {
                return res.status(404).json({ 
                    message: 'Review not found.' 
                });
            }

            res.status(200).json({
                message: 'Review deleted successfully!'
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
};

export default reviewControllers;