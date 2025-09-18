import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import userControllers from '../controllers/user.js';

const { register, login, logout } = userControllers;

const router = express.Router();

// routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// new route for dashboard to fetch user info
router.get('/me', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});
export default router;
