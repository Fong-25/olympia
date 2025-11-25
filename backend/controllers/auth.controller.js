import {
    createUser,
    validateEmail,
    getUserByEmail,
    getUserById
} from '../services/user.service.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email address" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" })
        }
        const existingEmail = await getUserByEmail(email)
        if (existingEmail) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await createUser({
            fullName,
            email,
            password: hashedPassword,
        })
        const token = jwt.sign({ userId: newUser.id, }, JWT_SECRET, { expiresIn: '30' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        return res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Sign up error:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const user = await getUserByEmail(email)
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const token = jwt.sign({ userId: user.id, }, JWT_SECRET, { expiresIn: '30' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        return res.status(200).json({ message: 'Login successfully' })
    } catch (error) {
        console.error('Log in error:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const logout = async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(400).json({ message: 'No user is logged in' })
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        })
        return res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        console.error('Log out error:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}