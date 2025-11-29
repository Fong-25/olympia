import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import dotenv from 'dotenv'
dotenv.config()

export const verifySocketAuth = (socket, next) => {
    try {
        const rawCookie = socket.handshake.headers.cookie
        const cookies = cookie.parse(rawCookie || '')
        const token = cookies.token

        if (!token) {
            return next(new Error('UNAUTHORIZED'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        socket.user = { userId: decoded.userId }
        next()
    } catch (err) {
        console.error('Socket auth error:', err.message)
        return next(new Error('UNAUTHORIZED'))
    }
}