const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generates a signed upload signature so the frontend can upload directly
 * to Cloudinary without exposing the API secret.
 */
const generateUploadSignature = () => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'edumart/listings';

    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET
    );

    return {
        signature,
        timestamp,
        folder,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
    };
};

module.exports = { cloudinary, generateUploadSignature };
