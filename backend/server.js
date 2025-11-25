import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import path from 'path'
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome")
})

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})