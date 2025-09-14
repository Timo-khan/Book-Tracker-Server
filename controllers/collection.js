import Favorite from '../models/favorite.js';
import ToRead from '../models/toRead.js';
import HaveRead from '../models/haveRead.js';

const collectionControllers = {
    // Create a new "favorite" book entry
    favorite: async (req, res) => {
        try {
            // Spread all fields from req.body into the new document
            const newFavorite = await Favorite.create({ ...req.body });

            res.status(201).json({
                book: newFavorite,
                message: 'Book added to favorites successfully!'
            });
        } catch (err) {
            if (err.code === 11000) {
                // Duplicate key error (e.g., google_id already exists)
                return res.status(400).json({
                    error: 'This book is already in your favorites.'
                });
            }
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new "to-read" book entry
    toRead: async (req, res) => {
        try {
            const newToRead = await ToRead.create({ ...req.body });

            res.status(201).json({
                book: newToRead,
                message: 'Book added to To-Read list successfully!'
            });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).json({
                    error: 'This book is already in your To-Read list.'
                });
            }
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new "have-read" book entry
    haveRead: async (req, res) => {
        try {
            const newHaveRead = await HaveRead.create({ ...req.body });

            res.status(201).json({
                book: newHaveRead,
                message: 'Book added to Have-Read list successfully!'
            });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).json({
                    error: 'This book is already in your Have-Read list.'
                });
            }
            res.status(500).json({ error: err.message });
        }
    }
};

export default collectionControllers;