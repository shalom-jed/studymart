const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createListing = async (listingData) => {
    return await prisma.listing.create({
        data: listingData,
    });
};

const deleteListing = async (id) => {
    return await prisma.listing.delete({
        where: { id }
    });
};

// UPGRADED: Now accepts search, subject, and category filters
const getAllListings = async (query = {}) => {
    const { search, subject, category } = query;

    let whereClause = {};

    // If a user types in the search bar, look in both the title and description
    if (search) {
        whereClause.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (subject) whereClause.subject = subject;
    if (category) whereClause.category = category;

    return await prisma.listing.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }, // Newest first
        include: {
            seller: { select: { id: true, name: true } }
        }
    });
};

const getListingById = async (id) => {
    return await prisma.listing.findUnique({
        where: { id },
        include: {
            seller: { select: { id: true, name: true } }
        }
    });
};

const getListingsByUserId = async (userId) => {
    return await prisma.listing.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: 'desc' }
    });
};

module.exports = {
    createListing,
    getAllListings,
    getListingById,
    getListingsByUserId,
    deleteListing
};