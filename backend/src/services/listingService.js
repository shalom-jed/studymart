const listingRepository = require('../repositories/listingRepository');

const createNewListing = async (sellerId, listingData) => {
    // Attach the logged-in user's ID to the listing
    const dataToSave = {
        ...listingData,
        sellerId,
    };
    return await listingRepository.createListing(dataToSave);
};

const fetchAllListings = async (queryFilters) => {
    // We can expand this later to filter by subject, category, etc.
    return await listingRepository.getAllListings(queryFilters);
};

const fetchListingDetails = async (id) => {
    const listing = await listingRepository.getListingById(id);
    if (!listing) {
        throw new Error('Listing not found');
    }
    return listing;
};

module.exports = {
    createNewListing,
    fetchAllListings,
    fetchListingDetails,
};