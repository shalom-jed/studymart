const express = require('express');
const router = express.Router();

// If your controller file has a different name, this require statement will fail silently!
const { sendMessage, getMyInbox } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/inbox', protect, getMyInbox);

module.exports = router;