import Favorite from '../models/favorite.js';
import ToRead from '../models/toRead.js';
import HaveRead from '../models/haveRead.js';

const collectionControllers = {
    favorite: async (req, res) => {

        try {
            const favorites = await Favorite.find();
            res.json(favorites);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    toRead: async (req, res) => {
        try {
            const toReadList = await ToRead.find();
            res.json(toReadList);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    haveRead: async (req, res) => {
        try {
            const haveReadList = await HaveRead.find();
            res.json(haveReadList);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default collectionControllers;