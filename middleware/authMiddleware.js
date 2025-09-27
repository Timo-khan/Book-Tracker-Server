import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // verify JWT
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        // find user from DB (fresh data, not just from token)
        const user = await User.findById(decoded.user._id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // attach user to request
        next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
