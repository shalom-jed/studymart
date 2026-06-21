const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createMessage = async (data) => {
    return await prisma.message.create({
        data: data,
    });
};

const getInbox = async (userId) => {
    // Fetch messages where the logged-in user is the receiver
    return await prisma.message.findMany({
        where: { receiverId: userId },
        include: {
            sender: { select: { name: true, email: true } },
            listing: { select: { title: true } }
        },
        orderBy: { createdAt: 'desc' } // Newest messages first
    });
};

module.exports = {
    createMessage,
    getInbox
};