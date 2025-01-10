const cron = require('node-cron');
const Crypto = require('../models/Crypto');

// Function to clean up old records and keep only the latest 10 for each coin
async function cleanupRecords() {
    try {
        // Get all distinct coins from the database
        const coins = await Crypto.distinct('coin');

        // Loop through each coin
        for (const coin of coins) {
            // Get the total count of records for the current coin
            const totalRecords = await Crypto.countDocuments({ coin });

            // If there are more than 10 records, delete the older ones to avoid storage flling
            if (totalRecords > 10) {
                const recordsToDelete = totalRecords - 10;

                // Delete the old records
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

// Schedule a cron job to run every minute (can be adjusted as needed)
cron.schedule('* * * * *', cleanupRecords);

module.exports = cleanupRecords;
