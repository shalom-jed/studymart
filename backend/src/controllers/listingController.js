const listingService = require('../services/listingService');

const create = async (req, res) => {
    try {
        // req.user.id comes from the protect middleware
        const newListing = await listingService.createNewListing(req.user.id, req.body);
        res.status(201).json({ success: true, data: newListing });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const listings = await listingService.fetchAllListings(req.query);
        res.status(200).json({ success: true, count: listings.length, data: listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOne = async (req, res) => {
    try {
        const listing = await listingService.fetchListingDetails(req.params.id);
        res.status(200).json({ success: true, data: listing });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

module.exports = {
    create,
    getAll,
    getOne,
};