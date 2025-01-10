const axios = require('axios');
const CryptoData = require('../models/CryptoData');

const fetchCryptoData = async () => {
    const coins = ['bitcoin', 'ethereum', 'matic-network'];
    const apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
    console.log('In fetchCryptoData');

    try {
        const response = await axios.get(apiUrl, {
            params: {
                ids: coins.join(','),
                vs_currencies: 'usd',
                include_market_cap: true,
                include_24hr_change: true,
            },
        });

        for (const coin of coins) {
            const data = response.data[coin];

            // Updating or creating a new entry for each coin
            await CryptoData.findOneAndUpdate(
                { coin },
                {
                    price: data.usd,
                    marketCap: data.usd_market_cap,
                    change24h: data.usd_24h_change,
                    updatedAt: new Date(),
                },
                { upsert: true, new: true }
            );
        }

        console.log('Data fetched and stored/updated successfully.');
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

module.exports = fetchCryptoData;
