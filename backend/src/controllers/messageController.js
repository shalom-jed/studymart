const messageRepository = require('../repositories/messageRepository');
const listingRepository = require('../repositories/listingRepository');

const sendMessage = async (req, res) => {
    try {
        const { listingId, content } = req.body;
        const senderId = req.user.id;

        const listing = await listingRepository.getListingById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        if (listing.sellerId === senderId) {
            return res.status(400).json({ success: false, message: "You cannot message yourself." });
        }

        const newMessage = await messageRepository.createMessage({
            content,
            listingId,
            senderId,
            receiverId: listing.sellerId
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyInbox = async (req, res) => {
    try {
        const messages = await messageRepository.getInbox(req.user.id);
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendMessage,
    getMyInbox
};