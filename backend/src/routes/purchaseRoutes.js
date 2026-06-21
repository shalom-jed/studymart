const express = require('express');
const router = express.Router();
const { createPurchase, getMyPurchaseRequests } = require('../controllers/purchaseController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createPurchase);
router.get('/my-requests', protect, getMyPurchaseRequests);

module.exports = router;
