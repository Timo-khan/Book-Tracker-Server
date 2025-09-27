import Favorite from '../models/favorite.js';
import ToRead from '../models/toRead.js';
import HaveRead from '../models/haveRead.js';
import CurrentRead from '../models/currentRead.js';

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
                return res.status(400).json({
                    error: 'This book is already in your Have-Read list.'
                });
            }
            res.status(500).json({ error: err.message });
        }
    },

    // GET endpoints
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

    // DELETE endpoints
    deleteFavorite: async (req, res) => {
        try {
            const deleted = await Favorite.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            if (!deleted) {
                return res.status(404).json({
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
    // DELETE endpoints
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
    // DELETE endpoints
    deleteHaveRead: async (req, res) => {
        try {
            const deleted = await HaveRead.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            if (!deleted) {
                return res.status(404).json({
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
    },

    //Add to Current Reads
    currentRead: async (req, res) => {
        try {
            const book = await CurrentRead.create({
                ...req.body,
                user: req.user._id
            });
            res.status(201).json({
                book,
                message: 'Book added to Current Reads!'
            });
        } catch (err) {
            if (err.code === 11000) {
                return res
                    .status(400)
                    .json({ error: 'Already in your Current Reads.' });
            }
            res.status(500).json({ error: err.message });
        }
    },

    // Get Current Reads
    getCurrentReads: async (req, res) => {
        try {
            const items = await CurrentRead.find({ user: req.user._id }).sort({
                createdAt: -1
            });
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Delete Current Read
    deleteCurrentRead: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await CurrentRead.findOneAndDelete({
                _id: id,
                user: req.user._id
            });
            if (!deleted)
                return res
                    .status(404)
                    .json({ error: 'Book not found or not yours.' });
            res.json({ message: 'Removed from Current Reads.', book: deleted });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Transfer Current Read → Have Read
    transferToHaveRead: async (req, res) => {
        try {
            const { id } = req.params;

            const book = await CurrentRead.findOne({
                _id: id,
                user: req.user._id
            });
            if (!book)
                return res
                    .status(404)
                    .json({ error: 'Book not found in Current Reads.' });

            // remove from current reads
            await CurrentRead.deleteOne({ _id: id, user: req.user._id });

            // add to have-read
            const newHaveRead = await HaveRead.create({
                google_id: book.google_id,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                published_date: book.published_date,
                description: book.description,
                thumbnail_url: book.thumbnail_url,
                isbn: book.isbn,
                category: book.category,
                webReaderLink: book.webReaderLink,
                pdfLink: book.pdfLink,
                epubLink: book.epubLink,
                user: req.user._id
            });

            res.json({ message: 'Moved to Have Read!', book: newHaveRead });
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
