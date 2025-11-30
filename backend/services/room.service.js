// This is used to take Room data, not for socket handler in Room

import prisma from '../config/prisma.js'

export const createRoom = async ({ name, createdById }) => {
    const room = prisma.room.create({
        data: {
            name,
            createdById,
            isActive: true,
            isArchived: false
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        }
    })
    return room
}

export const getRoomById = async (roomId) => {
    const room = prisma.room.findUnique({
        where: { id: roomId },
        include: {
            createdBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true
                        }
                    }
                }
            },
            questions: {
                orderBy: [
                    { round: "asc" },
                    { orderIndex: "asc" }
                ]
            },
            gameState: true
        }
    })
    return room
}

export const getRoomByName = async (name) => {
    const room = await prisma.room.findFirst({
        where: { name }
    })
    return room
}

export const getUserRooms = async (userId) => {
    const rooms = await prisma.room.findMany({
        where: {
            createdById: userId,
            isArchived: false
        },
        orderBy: {
            createdAt: "asc"
        },
        include: {
            participants: {
                select: {
                    role: true
                }
            }
        }
    })
    return rooms
}

export const getParticipatedRooms = async (userId) => {
    const participations = await prisma.roomParticipant.findMany({
        where: {
            userId,
            room: {
                isArchived: false
            }
        },
        include: {
            room: {
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            fullName: true
                        }
                    },
                    participants: {
                        select: {
                            role: true
                        }
                    }
                }
            }
        },
        orderBy: {
            joinedAt: 'desc'
        }
    })
    return participations.map(p => ({
        ...p.room,
        myRole: p.role
    }))
}

export const archiveRoom = async (roomId) => {
    const room = await prisma.room.update({
        where: { id: roomId },
        data: {
            isArchived: true,
            isActive: false
        }
    })
    return room
}

export const addParticipant = async ({ roomId, userId, role, displayName, position = null }) => {
    const participant = await prisma.roomParticipant.create({
        data: {
            roomId,
            userId,
            role,
            displayName,
            position
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    })
    return participant
}

export const getParticipant = async (roomId, userId) => {
    const participant = await prisma.roomParticipant.findUnique({
        where: {
            roomId_userId: {
                roomId,
                userId
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true
                }
            }
        }
    })
    return participant
}

export const removeParticipant = async (roomId, userId) => {
    await prisma.roomParticipant.delete({
        where: {
            roomId_userId: {
                roomId,
                userId
            }
        }
    })
}

export const updateParticipant = async (participantId, data) => {
    const participant = await prisma.roomParticipant.update({
        where: { id: participantId },
        data
    })
    return participant
}