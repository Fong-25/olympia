import express from 'express'
import { getLobby } from '../controllers/lobby.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', authMiddleware, getLobby)

export default router