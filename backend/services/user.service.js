import pool from "../config/db.js";
import prisma from '../config/prisma.js'

export const createUser = async ({ email, fullName, password }) => {
    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            password
        },
        select: {
            id: true,
            email: true,
            fullName: true
        }
    })
    return user
}

export const validateEmail = async (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
}

export const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })
    return user
}

export const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id }
    })
    return user
}