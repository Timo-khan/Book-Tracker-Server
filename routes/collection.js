import express from 'express';

import collectionControllers from '../controllers/collection.js';

import { authMiddleware } from "../middleware/authMiddleware.js";

const { favorite, toRead, haveRead, getFavorites, getToRead, getHaveRead,  deleteFavorite,
    deleteToRead, deleteHaveRead, } = collectionControllers;

const router = express.Router();
/* POST routes (add books) */
router.post('/favorites', authMiddleware, favorite);
router.post('/to-read', authMiddleware, toRead);
router.post('/have-read', authMiddleware, haveRead);

/* GET routes (fetch books) */
router.get('/favorites', authMiddleware, getFavorites);
router.get('/to-read', authMiddleware, getToRead);
router.get('/have-read', authMiddleware, getHaveRead);

router.delete("/favorites/:id", authMiddleware, deleteFavorite);
router.delete("/to-read/:id", authMiddleware, deleteToRead);
router.delete("/have-read/:id", authMiddleware, deleteHaveRead);

// When a user hits /api/collections/favorites:
// authMiddleware runs → checks the JWT cookie, verifies token, loads user from DB.
// If valid → attaches the user to req.user.
// Then your controller (favorite) executes and has access to req.user.
// If the user isn’t logged in (no cookie, expired token, or invalid token), they’ll
// get a 401 Not Authenticated response and your controller will never run.

// routes
// router.post('/favorites', favorite);
// router.post('/to-read', toRead);
// router.post('/have-read', haveRead);

// router.post(
//     '/favorites',
//     (req, res, next) => {
//         console.log('HIT /api/collections/favorites');
//         next();
//     },
//     favorite
// );

export default router;
