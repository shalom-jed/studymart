const express = require('express');
const router = express.Router();
const { getUploadSignature } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

// Only logged-in users can get a signature to upload
router.get('/sign', protect, getUploadSignature);

module.exports = router;
