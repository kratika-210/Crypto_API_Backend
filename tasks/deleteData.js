// In routes/api.js or a similar file where routes are handled
const express = require('express');
const router = express.Router();
const Crypto = require('../models/Crypto');

// Route to delete all records for a specific coin (e.g., "bitcoin")
router.delete('/delete-coin', async (req, res) => {
    try {
        // Find and delete all records for the 'bitcoin' coin
        const result = await Crypto.deleteMany({ coin: 'ethereum' });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No data found for the requested coin' });
        }

        // Return success message
        res.json({ message: 'All data for bitcoin has been deleted' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
