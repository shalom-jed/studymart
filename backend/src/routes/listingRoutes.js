const express = require('express');
const { create, getAll, getOne } = require('../controllers/listingController');
const { protect } = require('../middlewares/authMiddleware'); // Import the bouncer

const router = express.Router();

// Public routes
router.get('/', getAll);
router.get('/:id', getOne);

// Protected route - requires JWT token
router.post('/', protect, create);

module.exports = router;