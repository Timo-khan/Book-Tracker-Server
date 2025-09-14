import express from 'express';

import collectionControllers from '../controllers/collection.js';

const { favorite, toRead, haveRead } = collectionControllers;

const router = express.Router();

// routes
router.post('/favorites', favorite);
router.post('/to-read', toRead);
router.post('/have-read', haveRead);

router.post(
    '/favorites',
    (req, res, next) => {
        console.log('HIT /api/collections/favorites');
        next();
    },
    favorite
);

export default router;
