// socket.js
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

export const setupSocket = (io) => {
    io.use((socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie
            const cookies = cookie.parse(rawCookie || "")
            const token = cookies.token

            if (!token) {
                console.log("No token in handshake")
                return next(new Error("Unauthorized"))
            }

            const user = jwt.verify(token, process.env.JWT_SECRET)
            socket.user = user
            next()
        } catch (err) {
            console.log("Socket auth error:", err.message)
            return next(new Error("Unauthorized"))
        }
    })
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`)
        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`)
        })
    })
}