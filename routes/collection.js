import express from 'express';

import collectionControllers from '../controllers/collection.js';

const { favorite, toRead, haveRead } = collectionControllers;

const router = express.Router();

// routes
router.post('/favorite', favorite);
router.post('/toRead', toRead);
router.post('/haveRead', haveRead);

export default router;
