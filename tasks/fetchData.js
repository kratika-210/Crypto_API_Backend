const axios = require('axios');
const Crypto = require('../models/Crypto');
const cron = require('node-cron');

// Function to fetch cryptocurrency data from an external API and save it to the database
const fetchData = async () => {
    try {
        const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: 'bitcoin,matic-network,ethereum', // List of coins to fetch
            },
        });

        // Save each coin's data to the database
        for (const coin of data) {
            const { id, current_price, market_cap, price_change_percentage_24h } = coin;

            await Crypto.create({
                coin: id,
                price: current_price,
                marketCap: market_cap,
                change24h: price_change_percentage_24h,
            });
        }

        console.log('Data fetched and stored successfully');
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

// Schedule the job to run every 2 hours
cron.schedule('0 */2 * * *', fetchData);

module.exports = fetchData;
