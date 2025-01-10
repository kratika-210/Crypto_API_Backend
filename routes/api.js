const express = require('express');
const router = express.Router();
const Crypto = require('../models/Crypto');

// Route to get the latest statistics of a specific coin
router.get('/stats', async (req, res) => {
    try {
        const { coin } = req.query; // Get the coin name from the query parameters

        // Fetch the latest data for the given coin
        const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

        // If no data is found for the coin, return an error
        if (!latestData) {
            return res.status(404).json({ error: 'Data not found for the requested coin' });
        }

        // Return the coin's latest statistics
        res.json({
            price: latestData.price,
            marketCap: latestData.marketCap,
            '24hChange': latestData.change24h,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to calculate the deviation in the last 10 records for a coin
router.get('/deviation', async (req, res) => {
    try {
        const { coin } = req.query; // Get the coin name from the query parameters

        // Fetch the last 10 records for the given coin
        const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(10);

        // If no records are found, return an error
        if (records.length === 0) {
            return res.status(404).json({ error: 'No data available for deviation calculation' });
        }

        // If there are fewer than 2 records, return a default message
        if (records.length < 2) {
            return res.json({
                deviation: "0.00", // Deviation can't be calculated with fewer than two records
                message: "Not enough data for meaningful deviation calculation.",
            });
        }

        // Extract prices from the records and calculate the mean, variance, and standard deviation
        const prices = records.map(record => record.price);
        const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        const deviation = Math.sqrt(variance);

        // Return the calculated deviation along with the mean and record count
        res.json({
            deviation: deviation.toFixed(6),
            mean: mean.toFixed(2),
            count: records.length,
        });
    } catch (error) {
        console.error('Error calculating deviation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
