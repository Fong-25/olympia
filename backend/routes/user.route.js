import express from 'express'
import { uploadAvatar, updateProfile, deleteAvatar } from '../controllers/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { avatarUpload } from '../config/cloudinary.config.js'

const router = express.Router()

// Protected routes
router.post('/avatar', authMiddleware, avatarUpload.single('avatar'), uploadAvatar)
router.put('/profile', authMiddleware, updateProfile)
router.delete('/avatar', authMiddleware, deleteAvatar)

export default router