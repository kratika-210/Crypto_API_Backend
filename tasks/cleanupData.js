const cron = require('node-cron');
const Crypto = require('../models/Crypto');  // Make sure to use the correct path for your model

// Function to clean up records
async function cleanupRecords() {
    try {
        // Find all distinct coins in the database
        const coins = await Crypto.distinct('coin');

        for (const coin of coins) {
            // Fetch the total count of records for the given coin
            const totalRecords = await Crypto.countDocuments({ coin });

            // If there are more than 10 records, delete the older ones
            if (totalRecords > 10) {
                const recordsToDelete = totalRecords - 10;

                // Delete the older records
                await Crypto.deleteMany({
                    coin,
                    timestamp: { $lt: new Date(new Date().setDate(new Date().getDate() - recordsToDelete)) },
                });

                console.log(`Deleted ${recordsToDelete} old records for ${coin}, keeping only the latest 10.`);
            }
        }
    } catch (error) {
        console.error('Error cleaning up records:', error);
    }
}

// Schedule a cron job to run every 1 minute (can be adjusted)
cron.schedule('* * * * *', cleanupRecords);

module.exports = cleanupRecords;
