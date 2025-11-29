// socket.js
import { Server } from 'socket.io'
import { verifySocketAuth } from './middlewares/auth.middleware.js'

import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

export const setupSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    })

    // Global middleware
    io.use(verifySocketAuth)


    io.on('connection', (socket) => {
        console.log(`${socket.id} connected, User: ${socket.user.userId}`)

        // Register all socket event handlers here
        // Example:
        // registerRoomHandlers(io, socket) (from './handlers/room.handler.js')
        // registerTechHandlers(io, socket)

        //Disconnect
        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`)
        })
    })
    return io
}