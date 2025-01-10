const express = require('express');
const router = express.Router();
const Crypto = require('../models/Crypto');

// Route to get the latest statistics for a coin
router.get('/stats', async (req, res) => {
    try {
        const { coin } = req.query;

        // Fetch the latest data for the given coin
        const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

        if (!latestData) {
            return res.status(404).json({ error: 'Data not found for the requested coin' });
        }

        // Return the statistics
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

// Route to calculate the deviation of the last 10 records
router.get('/deviation', async (req, res) => {
    try {
        const { coin } = req.query;

        // Fetch the last 10 records for the given coin (limit to 10 records)
        const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(10);

        if (records.length === 0) {
            return res.status(404).json({ error: 'No data available for deviation calculation' });
        }

        // Handle cases with fewer than two records
        if (records.length < 2) {
            return res.json({
                deviation: "0.00", // Deviation is not meaningful with fewer records
                message: "Not enough data for meaningful deviation calculation.",
            });
        }

        // Extract prices and calculate mean, variance, and standard deviation
        const prices = records.map(record => record.price);
        const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;

        // Calculate variance and standard deviation
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        const deviation = Math.sqrt(variance);

        // Return the deviation and optional additional information
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
