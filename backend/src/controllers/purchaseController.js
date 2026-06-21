const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * POST /api/purchases
 * Creates a Purchase record (Buy Now request) and auto-sends a message to the seller.
 */
const createPurchase = async (req, res) => {
    try {
        const { listingId, message } = req.body;
        const buyerId = req.user.id;

        // 1. Validate listing exists and is available
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            include: { seller: { select: { id: true, name: true } } }
        });

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        if (listing.status === 'SOLD') {
            return res.status(400).json({ success: false, message: 'This item has already been sold' });
        }

        if (listing.sellerId === buyerId) {
            return res.status(400).json({ success: false, message: 'You cannot buy your own listing' });
        }

        // 2. Create the purchase record
        const purchase = await prisma.purchase.create({
            data: {
                listingId,
                buyerId,
                status: 'PENDING',
                message: message || null,
            }
        });

        // 3. Auto-send a message to the seller notifying them
        const autoMessage = `🛒 **Buy Now Request!**\n\nHi ${listing.seller.name}, I'd like to buy "${listing.title}" for Rs. ${listing.price}.\n\n${message ? `Buyer's note: ${message}` : 'Please confirm your availability so we can arrange the exchange.'}`;

        await prisma.message.create({
            data: {
                listingId,
                senderId: buyerId,
                receiverId: listing.sellerId,
                content: autoMessage,
            }
        });

        res.status(201).json({
            success: true,
            message: 'Purchase request sent! The seller has been notified.',
            data: purchase
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/purchases/my-requests
 * Get all purchase requests the logged-in user has made.
 */
const getMyPurchaseRequests = async (req, res) => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: { buyerId: req.user.id },
            include: {
                listing: {
                    select: { id: true, title: true, price: true, status: true, photos: true, seller: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPurchase, getMyPurchaseRequests };
