import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Storage factory - create storage configs on demand
export const createStorage = (options = {}) => {
    const {
        folder = 'uploads',
        allowedFormats = ['jpg', 'jpeg', 'png', 'webp'],
        transformation = []
    } = options

    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder,
            allowed_formats: allowedFormats,
            transformation: transformation.length > 0 ? transformation : undefined,
            resource_type: 'auto' // auto-detect: image, video, raw
        }
    })
}

// File filter factory - create validators on demand
export const createFileFilter = (options = {}) => {
    const {
        allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    } = options

    return (req, file, cb) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`), false)
        }
    }
}

// Upload factory - create multer instances on demand
export const createUpload = (options = {}) => {
    const {
        folder = 'uploads',
        allowedFormats = ['jpg', 'jpeg', 'png', 'webp'],
        allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxSize = 2 * 1024 * 1024, // 2MB default
        transformation = []
    } = options

    const storage = createStorage({ folder, allowedFormats, transformation })
    const fileFilter = createFileFilter({ allowedMimes })

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: maxSize }
    })
}

// Predefined uploads for common use cases, mostly use this
export const avatarUpload = createUpload({
    folder: 'avatars',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    allowedMimes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 2 * 1024 * 1024, // 2MB for avatar
    transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'auto' },
        { quality: 'auto:good' }
    ]
})

export const videoUpload = createUpload({
    folder: 'videos',
    allowedFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    allowedMimes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'],
    maxSize: 20 * 1024 * 1024 // 50MB
})

export const audioUpload = createUpload({
    folder: 'audio',
    allowedFormats: ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
    allowedMimes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac'],
    maxSize: 5 * 1024 * 1024 // 10MB
})

export const imageUpload = createUpload({
    folder: 'images',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    allowedMimes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 3 * 1024 * 1024 // 5MB
})

export const documentUpload = createUpload({
    folder: 'documents',
    allowedFormats: ['pdf', 'doc', 'docx', 'txt'],
    allowedMimes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    maxSize: 10 * 1024 * 1024 // 10MB
})

export default cloudinary