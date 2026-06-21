const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createListing = async (listingData) => {
    return await prisma.listing.create({
        data: listingData,
    });
};

const getAllListings = async (filters = {}) => {
    return await prisma.listing.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' }, // Newest first
        include: {
            seller: {
                select: { id: true, name: true, district: true } // Only pull safe user data
            }
        }
    });
};

const getListingById = async (id) => {
    return await prisma.listing.findUnique({
        where: { id },
        include: {
            seller: {
                select: { id: true, name: true, district: true, profilePhoto: true }
            }
        }
    });
};

module.exports = {
    createListing,
    getAllListings,
    getListingById,
};