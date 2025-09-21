import jwt from 'jsonwebtoken';
import Collection from '../models/collection.js';
import User from '../models/user.js';

// Helper function to get user ID from token
const getUserIdFromToken = (req) => {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded.user._id;
};

const collectionControllers = {
    // Add book to collection
    addToCollection: async (req, res) => {
        const { bookId, collectionType, bookData } = req.body;

        try {
            const userId = getUserIdFromToken(req);

            // Validate collection type
            const validTypes = ['favorites', 'to-read', 'have-read'];
            if (!validTypes.includes(collectionType)) {
                return res.status(400).json({ 
                    message: 'Invalid collection type. Must be favorites, to-read, or have-read.' 
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

            // Check if book already exists in this collection for this user
            const existingEntry = await Collection.findOne({ 
                userId, 
                bookId, 
                collectionType 
            });

            if (existingEntry) {
                return res.status(400).json({ 
                    message: `Book already exists in ${collectionType} collection.` 
                });
            }

            const newCollectionEntry = new Collection({
                userId,
                bookId,
                collectionType,
                bookData: {
                    title: bookData.title,
                    authors: bookData.authors || [],
                    thumbnail: bookData.thumbnail || null,
                    publishedDate: bookData.publishedDate || null,
                    description: bookData.description || null,
                    pageCount: bookData.pageCount || null
                }
            });

            await newCollectionEntry.save();

            res.status(201).json({
                collection: newCollectionEntry,
                message: `Book added to ${collectionType} successfully!`
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Get user's collection by type
    getCollection: async (req, res) => {
        const { type } = req.params;

        try {
            const userId = getUserIdFromToken(req);

            // Validate collection type
            const validTypes = ['favorites', 'to-read', 'have-read'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ 
                    message: 'Invalid collection type. Must be favorites, to-read, or have-read.' 
                });
            }

            const collection = await Collection.find({ 
                userId, 
                collectionType: type 
            }).sort({ createdAt: -1 });

            res.status(200).json({
                collection,
                count: collection.length,
                message: `${type} collection retrieved successfully!`
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Get all collections for a user
    getAllCollections: async (req, res) => {
        try {
            const userId = getUserIdFromToken(req);

            const collections = await Collection.find({ userId }).sort({ createdAt: -1 });

            // Group by collection type
            const groupedCollections = {
                favorites: collections.filter(item => item.collectionType === 'favorites'),
                'to-read': collections.filter(item => item.collectionType === 'to-read'),
                'have-read': collections.filter(item => item.collectionType === 'have-read')
            };

            res.status(200).json({
                collections: groupedCollections,
                totalCount: collections.length,
                message: 'All collections retrieved successfully!'
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Remove book from collection
    removeFromCollection: async (req, res) => {
        const { bookId, type } = req.params;

        try {
            const userId = getUserIdFromToken(req);

            // Validate collection type
            const validTypes = ['favorites', 'to-read', 'have-read'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ 
                    message: 'Invalid collection type. Must be favorites, to-read, or have-read.' 
                });
            }

            const deletedEntry = await Collection.findOneAndDelete({ 
                userId, 
                bookId, 
                collectionType: type 
            });

            if (!deletedEntry) {
                return res.status(404).json({ 
                    message: `Book not found in ${type} collection.` 
                });
            }

            res.status(200).json({
                message: `Book removed from ${type} successfully!`
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Move book between collections
    moveToCollection: async (req, res) => {
        const { bookId, fromType, toType } = req.body;

        try {
            const userId = getUserIdFromToken(req);

            const validTypes = ['favorites', 'to-read', 'have-read'];
            if (!validTypes.includes(fromType) || !validTypes.includes(toType)) {
                return res.status(400).json({ 
                    message: 'Invalid collection types.' 
                });
            }

            if (fromType === toType) {
                return res.status(400).json({ 
                    message: 'From and to collection types cannot be the same.' 
                });
            }

            // Find the book in the source collection
            const sourceEntry = await Collection.findOne({ 
                userId, 
                bookId, 
                collectionType: fromType 
            });

            if (!sourceEntry) {
                return res.status(404).json({ 
                    message: `Book not found in ${fromType} collection.` 
                });
            }

            // Check if book already exists in target collection
            const targetEntry = await Collection.findOne({ 
                userId, 
                bookId, 
                collectionType: toType 
            });

            if (targetEntry) {
                return res.status(400).json({ 
                    message: `Book already exists in ${toType} collection.` 
                });
            }

            // Update the collection type
            sourceEntry.collectionType = toType;
            await sourceEntry.save();

            res.status(200).json({
                collection: sourceEntry,
                message: `Book moved from ${fromType} to ${toType} successfully!`
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
};

export default collectionControllers;