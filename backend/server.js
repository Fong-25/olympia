import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import path from 'path'
import authRoutes from './routes/auth.route.js'
import lobbyRoutes from './routes/lobby.route.js'
import userRoutes from './routes/user.route.js'
import roomRoutes from './routes/room.route.js'
import http from 'http'
import { setupSocket } from "./socket/index.js";
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const server = http.createServer(app)

const io = setupSocket(server)

app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome")
})

app.use('/api/auth', authRoutes)
app.use('/api/lobby', lobbyRoutes)
app.use('/api/user', userRoutes)
app.use('api/rooms', roomRoutes)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})