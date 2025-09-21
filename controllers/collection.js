import Favorite from '../models/favorite.js';
import ToRead from '../models/toRead.js';
import HaveRead from '../models/haveRead.js';

const collectionControllers = {
    // Create a new "favorite" book entry
    favorite: async (req, res) => {
        try {
            const newFavorite = await Favorite.create({
                ...req.body,
                user: req.user._id // from authMiddleware
            });

            res.status(201).json({
                book: newFavorite,
                message: 'Book added to favorites successfully!'
            });
        } catch (err) {
            if (err.code === 11000) {
                return res
                    .status(400)
                    .json({ error: 'This book is already in your favorites.' });
            }
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new "to-read" book entry
    toRead: async (req, res) => {
        try {
            const newToRead = await ToRead.create({
                ...req.body,
                user: req.user._id
            });

            res.status(201).json({
                book: newToRead,
                message: 'Book added to To-Read list successfully!'
            });
        } catch (err) {
            if (err.code === 11000) {
                return res
                    .status(400)
                    .json({
                        error: 'This book is already in your To-Read list.'
                    });
            }
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new "have-read" book entry
    haveRead: async (req, res) => {
        try {
            const newHaveRead = await HaveRead.create({
                ...req.body,
                user: req.user._id
            });

            res.status(201).json({
                book: newHaveRead,
                message: 'Book added to Have-Read list successfully!'
            });
        } catch (err) {
            if (err.code === 11000) {
                return res
                    .status(400)
                    .json({
                        error: 'This book is already in your Have-Read list.'
                    });
            }
            res.status(500).json({ error: err.message });
        }
    },

    // 🔹 GET endpoints
    getFavorites: async (req, res) => {
        try {
            const favorites = await Favorite.find({ user: req.user._id });
            res.json(favorites);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getToRead: async (req, res) => {
        try {
            const toRead = await ToRead.find({ user: req.user._id });
            res.json(toRead);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getHaveRead: async (req, res) => {
        try {
            const haveRead = await HaveRead.find({ user: req.user._id });
            res.json(haveRead);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // 🔹 DELETE endpoints
    deleteFavorite: async (req, res) => {
        try {
            const deleted = await Favorite.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            if (!deleted) {
                return res
                    .status(404)
                    .json({
                        error: 'Book not found in favorites or not yours.'
                    });
            }

            res.json({
                message: 'Book removed from favorites.',
                book: deleted
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteToRead: async (req, res) => {
        try {
            const deleted = await ToRead.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            if (!deleted) {
                return res
                    .status(404)
                    .json({ error: 'Book not found in To-Read or not yours.' });
            }

            res.json({ message: 'Book removed from To-Read.', book: deleted });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteHaveRead: async (req, res) => {
        try {
            const deleted = await HaveRead.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            if (!deleted) {
                return res
                    .status(404)
                    .json({
                        error: 'Book not found in Have-Read or not yours.'
                    });
            }

            res.json({
                message: 'Book removed from Have-Read.',
                book: deleted
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default collectionControllers;

// How it all works together

// authMiddleware checks the cookie → attaches req.user (from MongoDB).

// In your controller, req.user._id tells you which user is making the request.

// When you save the new Collection, you always include user: req.user._id.

// That way, every collection entry is tied to the logged-in user.
