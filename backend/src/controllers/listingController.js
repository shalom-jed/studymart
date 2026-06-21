const listingRepository = require('../repositories/listingRepository');

// 1. Create a new listing
const createListing = async (req, res) => {
    try {
        const listingData = {
            ...req.body,
            sellerId: req.user.id, // Attached by the JWT protect middleware
        };
        const newListing = await listingRepository.createListing(listingData);
        res.status(201).json({ success: true, data: newListing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get all listings (with search/filters)
const getAllListings = async (req, res) => {
    try {
        const listings = await listingRepository.getAllListings(req.query);
        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get a single listing by ID
const getListingById = async (req, res) => {
    try {
        const listing = await listingRepository.getListingById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        res.status(200).json({ success: true, data: listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Get listings only for the logged-in user
const getMyListings = async (req, res) => {
    try {
        const listings = await listingRepository.getListingsByUserId(req.user.id);
        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Delete a specific listing (with security check)
const deleteMyListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await listingRepository.getListingById(listingId);

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        // SECURITY CHECK: Ensure the person deleting it actually owns it!
        if (listing.sellerId !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized to delete this listing" });
        }

        await listingRepository.deleteListing(listingId);
        res.status(200).json({ success: true, message: "Listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createListing,
    getAllListings,
    getListingById,
    getMyListings,
    deleteMyListing
};