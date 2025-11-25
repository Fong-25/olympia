import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

// const prisma = new PrismaClient({
//     log: ['warn', 'error'],
//     engineType: 'binary',
// })

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

BigInt.prototype.toJSON = function () {
    return this.toString();
};

process.on('beforeExit', async () => {
    await prisma.$disconnect()
})

export default prisma