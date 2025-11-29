// This is used to take data for Lobby pages, not for socket handler in Lobby

import { getLobbyData } from "../services/lobby.service.js";

export const getLobby = async (req, res) => {
    try {
        const userId = req.userId
        const data = await getLobbyData(userId)
        return res.status(200).json(data)
    } catch (error) {
        console.error('Lobby error: ', error)
        return res.status(500).json({ message: "Internal server error" });
    }
}