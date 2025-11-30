import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import {
    createNewRoom,
    getRoom,
    getMyRooms,
    deleteRoom
} from '../controllers/room.controller.js'

const router = express.Router()

// All routes require authentication
router.post('/create', authMiddleware, createNewRoom)
router.get('/my-rooms', authMiddleware, getMyRooms)
router.get('/:roomId', authMiddleware, getRoom)
router.delete('/:roomId', authMiddleware, deleteRoom)

export default router