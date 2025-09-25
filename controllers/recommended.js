import Recommended from '../models/recommended.js';

const recommendedController = {
    // Add a recommendation
    recommend: async (req, res) => {
        try {
            const book = await Recommended.create({
                ...req.body,
                user: req.user._id // logged in user
            });
            res.status(201).json({
                book,
                message: 'Book recommended successfully!'
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all recommended books (for homepage)
    getAll: async (req, res) => {
        try {
            const books = await Recommended.find()
                .sort({ createdAt: -1 })
                .limit(20); // latest 20
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default recommendedController;
