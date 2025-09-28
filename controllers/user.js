import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import validateEmail from '../utils/validateEmail.js';
import validateUsername from '../utils/validateUsername.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';

import User from '../models/user.js';

const userControllers = {
    register: async (req, res) => {
        const { firstName, lastName, username, email, password, rePassword } = req.body;

        try {
            // check if user exists
            const userExist = await User.findOne({ email });
            if (userExist) {
                return res.status(400).json({ message: 'User already exists, please login!' });
            }

            // step-by-step validation of email, password, username and matchPasswords
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email format.' });
            }

            if (!validateUsername(username)) {
                return res.status(400).json({ message: 'Invalid username.' });
            }

            if (!validatePassword(password)) {
                return res.status(400).json({ message: 'Password does not meet requirements.' });
            }

            if (!matchPasswords(password, rePassword)) {
                return res.status(400).json({ message: 'Passwords do not match.' });
            }

            // hash password
            const hashedPassword = await hashPassword(password);

            const newUser = new User({
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword
            });

            await newUser.save();

            // issue JWT token on signup
            const token = jwt.sign(
                { user: { _id: newUser._id } },
                process.env.TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none', // ✅ allow cross-site cookies
                secure: true      // ✅ required when sameSite = 'none'
                // sameSite: 'lax',
                // secure: process.env.NODE_ENV === 'production'
            });

            return res.status(201).json({
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    username: newUser.username,
                    email: newUser.email
                },
                message: 'User created and logged in successfully!'
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const userExist = await User.findOne({ email });
            if (!userExist) {
                return res.status(400).json({ message: 'Invalid email or password.' });
            }

            bcrypt.compare(password, userExist.password, (err, isValid) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: err.message });
                }

                if (isValid) {
                    const token = jwt.sign(
                        { user: { _id: userExist._id } },
                        process.env.TOKEN_SECRET,
                        { expiresIn: '1d' }
                    );

                    res.cookie('token', token, {
                        httpOnly: true,
                        sameSite: 'none', // allow cross-site cookies
                        secure: true      // required when sameSite = 'none'
                        // sameSite: 'lax',
                        // secure: process.env.NODE_ENV === 'production'
                    });

                    return res.status(200).json({
                        id: userExist._id,
                        username: userExist.username,
                        message: 'User logged in successfully!'
                    });
                } else {
                    return res.status(400).json({ message: 'Invalid email or password.' });
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    logout: async (req, res) => {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully!' });
    }
};

export default userControllers;