const express = require('express');
const router = express.Router();

// Import the specific functions from the controller
const {
    createListing,
    getAllListings,
    getListingById,
    getMyListings,
    deleteMyListing
} = require('../controllers/listingController');

// Import your auth bouncer
const { protect } = require('../middlewares/authMiddleware');

// --- ROUTES ---

// Public Routes
router.get('/', getAllListings);

// Protected Routes (Require JWT)
router.post('/', protect, createListing);
router.get('/my-listings', protect, getMyListings); // This MUST stay above /:id

// Dynamic Routes (The :id acts as a wildcard, so it goes last)
router.get('/:id', getListingById);
router.delete('/:id', protect, deleteMyListing);

module.exports = router;