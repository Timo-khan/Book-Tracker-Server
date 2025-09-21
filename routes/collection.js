import express from 'express';

import collectionControllers from '../controllers/collection.js';
import reviewControllers from '../controllers/review.js';
import verifyToken from '../middleware/verifyToken.js';

const { 
    addToCollection, 
    getCollection, 
    getAllCollections,
    removeFromCollection, 
    moveToCollection 
} = collectionControllers;

const {
    createOrUpdateReview,
    getUserReviews,
    getReviewByBook,
    deleteReview
} = reviewControllers;

const router = express.Router();

router.post('/collections/add', verifyToken, addToCollection);
router.get('/collections/:type', verifyToken, getCollection);
router.get('/collections', verifyToken, getAllCollections);
router.delete('/collections/:type/:bookId', verifyToken, removeFromCollection);
router.put('/collections/move', verifyToken, moveToCollection);

// Review routes (all require authentication)
router.post('/reviews', verifyToken, createOrUpdateReview);
router.get('/reviews', verifyToken, getUserReviews);
router.get('/reviews/:bookId', verifyToken, getReviewByBook);
router.delete('/reviews/:bookId', verifyToken, deleteReview);

export default router;