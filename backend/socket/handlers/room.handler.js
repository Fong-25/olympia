import {
    getRoomById,
    getRoomByName,
    addParticipant,
    getParticipant,
    removeParticipant,
    updateParticipant
} from '../../services/room.service.js'
import { getUserById } from '../../services/user.service.js'

export const registerRoomHandlers = (io, socket) => {
    // Join room
    socket.on('room:join', async (data) => {
        try {
            const { roomName, role } = data
            const userId = socket.user.userId

            // Validate role
            const validRoles = ['TECHNICIAN', 'MC', 'CANDIDATE', 'VIEWER']
            if (!validRoles.includes(role)) {
                socket.emit('room:error', { message: 'Invalid role' })
                return
            }

            // Find room by name
            const room = await getRoomByName(roomName)
            if (!room) {
                socket.emit('room:error', { message: 'Room not found' })
                return
            }

            if (!room.isActive) {
                socket.emit('room:error', { message: 'Room is not active' })
                return
            }

            // Check if user already in room
            const existingParticipant = await getParticipant(room.id, userId)
            if (existingParticipant) {
                // Rejoin with existing role
                socket.join(room.id)
                socket.emit('room:joined', {
                    roomId: room.id,
                    role: existingParticipant.role,
                    participant: existingParticipant
                })

                // Notify others
                socket.to(room.id).emit('room:participant_joined', {
                    participant: existingParticipant
                })
                return
            }

            // Get user info
            const user = await getUserById(userId)

            // Add participant
            const participant = await addParticipant({
                roomId: room.id,
                userId,
                role,
                displayName: user.fullName
            })

            // Join socket room
            socket.join(room.id)

            // Send success to joiner
            socket.emit('room:joined', {
                roomId: room.id,
                role: participant.role,
                participant
            })

            // Notify all in room
            io.to(room.id).emit('room:participant_update', {
                participant,
                action: 'joined'
            })

        } catch (error) {
            console.error('Room join error:', error)
            socket.emit('room:error', { message: 'Failed to join room' })
        }
    })

    // Leave room
    socket.on('room:leave', async (data) => {
        try {
            const { roomId } = data
            const userId = socket.user.userId

            const participant = await getParticipant(roomId, userId)
            if (!participant) {
                socket.emit('room:error', { message: 'Not in this room' })
                return
            }

            // Don't remove from DB, just leave socket room
            socket.leave(roomId)

            // Notify others
            socket.to(roomId).emit('room:participant_update', {
                participant,
                action: 'left'
            })

            socket.emit('room:left', { roomId })

        } catch (error) {
            console.error('Room leave error:', error)
            socket.emit('room:error', { message: 'Failed to leave room' })
        }
    })

    // Tech: Assign candidate position
    socket.on('tech:assign_position', async (data) => {
        try {
            const { roomId, candidateId, position } = data
            const userId = socket.user.userId

            // Verify tech permission
            const tech = await getParticipant(roomId, userId)
            if (!tech || tech.role !== 'TECHNICIAN') {
                socket.emit('room:error', { message: 'Unauthorized' })
                return
            }

            // Validate position
            if (![1, 2, 3, 4].includes(position)) {
                socket.emit('room:error', { message: 'Invalid position' })
                return
            }

            // Update participant
            await updateParticipant(candidateId, { position })

            // Notify all
            io.to(roomId).emit('room:participant_update', {
                candidateId,
                position,
                action: 'position_assigned'
            })

        } catch (error) {
            console.error('Assign position error:', error)
            socket.emit('room:error', { message: 'Failed to assign position' })
        }
    })

    // Tech: Update display name
    socket.on('tech:update_display_name', async (data) => {
        try {
            const { roomId, candidateId, displayName } = data
            const userId = socket.user.userId

            // Verify tech permission
            const tech = await getParticipant(roomId, userId)
            if (!tech || tech.role !== 'TECHNICIAN') {
                socket.emit('room:error', { message: 'Unauthorized' })
                return
            }

            if (!displayName || displayName.trim().length < 2) {
                socket.emit('room:error', { message: 'Display name too short' })
                return
            }

            // Update participant
            await updateParticipant(candidateId, { displayName: displayName.trim() })

            // Notify all
            io.to(roomId).emit('room:participant_update', {
                candidateId,
                displayName: displayName.trim(),
                action: 'display_name_updated'
            })

        } catch (error) {
            console.error('Update display name error:', error)
            socket.emit('room:error', { message: 'Failed to update display name' })
        }
    })

    // Tech: Kick participant
    socket.on('tech:kick_participant', async (data) => {
        try {
            const { roomId, participantId } = data
            const userId = socket.user.userId

            // Verify tech permission
            const tech = await getParticipant(roomId, userId)
            if (!tech || tech.role !== 'TECHNICIAN') {
                socket.emit('room:error', { message: 'Unauthorized' })
                return
            }

            const participant = await getParticipant(roomId, participantId)
            if (!participant) {
                socket.emit('room:error', { message: 'Participant not found' })
                return
            }

            // Can't kick technician
            if (participant.role === 'TECHNICIAN') {
                socket.emit('room:error', { message: 'Cannot kick technician' })
                return
            }

            // Remove from room
            await removeParticipant(roomId, participant.userId)

            // Force disconnect their socket
            const sockets = await io.in(roomId).fetchSockets()
            const targetSocket = sockets.find(s => s.user.userId === participant.userId)
            if (targetSocket) {
                targetSocket.leave(roomId)
                targetSocket.emit('room:kicked', { roomId, reason: 'Kicked by technician' })
            }

            // Notify all
            io.to(roomId).emit('room:participant_update', {
                participantId,
                action: 'kicked'
            })

        } catch (error) {
            console.error('Kick participant error:', error)
            socket.emit('room:error', { message: 'Failed to kick participant' })
        }
    })

    // Request current room state (for reconnection)
    socket.on('sync:request_state', async (data) => {
        try {
            const { roomId } = data
            const userId = socket.user.userId

            const participant = await getParticipant(roomId, userId)
            if (!participant) {
                socket.emit('room:error', { message: 'Not in this room' })
                return
            }

            const room = await getRoomById(roomId)

            socket.emit('sync:full_state', {
                room,
                gameState: room.gameState,
                participants: room.participants,
                myParticipant: participant
            })

        } catch (error) {
            console.error('Sync state error:', error)
            socket.emit('room:error', { message: 'Failed to sync state' })
        }
    })
}