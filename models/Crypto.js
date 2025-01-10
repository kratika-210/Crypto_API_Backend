const mongoose = require('mongoose');

// here define the schema for cryptocurrency data
const cryptoSchema = new mongoose.Schema({
    coin: { type: String, required: true }, // Name of the coin (e.g., bitcoin, ethereum)
    price: { type: Number, required: true }, // Current price of the coin
    marketCap: { type: Number, required: true }, // Market capitalization of the coin
    change24h: { type: Number, required: true }, // Price change in the last 24 hours
    timestamp: { type: Date, default: Date.now }, // Timestamp when the data was recorded
});

// then export the model based on the schema
module.exports = mongoose.model('Crypto', cryptoSchema);
