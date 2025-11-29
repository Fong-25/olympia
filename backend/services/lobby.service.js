// This is used to take data for Lobby pages, not for socket handler in Lobby

import prisma from "../config/prisma.js";

export const getLobbyData = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            email: true,
            fullName: true,
            avatarUrl: true
        }
    })

    // Fetch or data here, created room for example

    return {
        user,
    }
}