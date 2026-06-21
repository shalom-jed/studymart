const { generateUploadSignature } = require('../utils/cloudinary');

/**
 * GET /api/upload/sign
 * Returns a signed Cloudinary signature so the frontend can upload images directly.
 * Protected — only logged-in users can get a signature.
 */
const getUploadSignature = (req, res) => {
    try {
        const signatureData = generateUploadSignature();
        res.status(200).json({ success: true, data: signatureData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate upload signature' });
    }
};

module.exports = { getUploadSignature };
