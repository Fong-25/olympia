// This is used to take Room data, not for socket handler in Room

import {
    createRoom,
    getRoomById,
    getRoomByName,
    getUserRooms,
    getParticipatedRooms,
    archiveRoom
} from '../services/room.service.js'

export const createNewRoom = async (req, res) => {
    try {
        const { name } = req.body
        const userId = req.userId

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: 'Room name must be at least 3 characters' })
        }

        // Check if room name already exists
        const existingRoom = await getRoomByName(name)
        if (existingRoom) {
            return res.status(400).json({ message: 'Room name already exists. Choose another name.' })
        }

        const room = await createRoom({
            name: name.trim(),
            createdById: userId
        })

        return res.status(201).json({
            message: 'Room created successfully',
            room
        })
    } catch (error) {
        console.error('Create room error:', error)
        return res.status(500).json({ message: 'Failed to create room' })
    }
}

export const getRoom = async (req, res) => {
    try {
        const { roomId } = req.params
        const room = await getRoomById(roomId)

        if (!room) {
            return res.status(404).json({ message: 'Room not found' })
        }

        return res.status(200).json(room)
    } catch (error) {
        console.error('Get room error:', error)
        return res.status(500).json({ message: 'Failed to fetch room' })
    }
}

export const getMyRooms = async (req, res) => {
    try {
        const userId = req.userId

        // Get rooms created by user
        const createdRooms = await getUserRooms(userId)

        // Get rooms where user is a participant
        const participatedRooms = await getParticipatedRooms(userId)

        return res.status(200).json({
            createdRooms,
            participatedRooms
        })
    } catch (error) {
        console.error('Get my rooms error:', error)
        return res.status(500).json({ message: 'Failed to fetch rooms' })
    }
}

export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params
        const userId = req.userId

        const room = await getRoomById(roomId)

        if (!room) {
            return res.status(404).json({ message: 'Room not found' })
        }

        // Only creator can delete room
        if (room.createdById !== userId) {
            return res.status(403).json({ message: 'Only room creator can delete this room' })
        }

        await archiveRoom(roomId)

        return res.status(200).json({ message: 'Room deleted successfully' })
    } catch (error) {
        console.error('Delete room error:', error)
        return res.status(500).json({ message: 'Failed to delete room' })
    }
}