import { updateUserProfile, validateEmail, getUserById } from "../services/user.service.js";

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.staus(404).json({ message: "No image uploaded" })
        }
        const userId = req.userId // From auth middleware
        const avatarUrl = req.file.path // Cloudinary URL

        // Update user with new avatar
        const updatedUser = await updateUserProfile(userId, { avatarUrl })

        return res.status(200).json({
            message: 'Avatar uploaded successfully',
            avatarUrl: updatedUser.avatarUrl
        })
    } catch (error) {
        console.error('Avatar upload error:', error)
        return res.status(500).json({ message: 'Failed to upload avatar' })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { fullName, email } = req.body

        // Validate inputs
        if (!fullName && !email) {
            return res.status(400).json({ message: 'No fields to update' })
        }

        const updateData = {}

        // Validate and add fullName
        if (fullName) {
            if (fullName.trim().length < 2) {
                return res.status(400).json({ message: 'Full name must be at least 2 characters' })
            }
            updateData.fullName = fullName.trim()
        }

        // Validate and add email
        if (email) {
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email address' })
            }
            // Check if email is already taken by another user
            const existingUser = await getUserById(userId)
            if (existingUser.email !== email) {
                const emailTaken = await getUserByEmail(email)
                if (emailTaken) {
                    return res.status(400).json({ message: 'Email already in use' })
                }
            }
            updateData.email = email
        }

        // Update user
        const updatedUser = await updateUserProfile(userId, updateData)

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        })
    } catch (error) {
        console.error('Profile update error:', error)
        return res.status(500).json({ message: 'Failed to update profile' })
    }
}