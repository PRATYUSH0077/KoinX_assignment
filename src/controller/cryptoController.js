const CryptoData = require('../models/CryptoData');

// Handler function for / route
const homeRoute = async (req, res) => {
    try {
        const latestData = await CryptoData.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: { _id: '$coin', data: { $first: '$$ROOT' } } },
        ]);

        res.render('index', { coins: latestData });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

// Handler function for /stats route
const getStats = async (req, res) => {
    let { coin } = req.query;
    coin = coin ? coin.trim() : ''; // removing any leading space or new line character

    if (!coin) {
        return res.status(400).json({ error: 'Coin parameter is required' });
    }

    try {
        const data = await CryptoData.find({ coin: coin })
            .sort({ timestamp: -1 })
            .limit(1);

        if (!data) {
            return res.status(404).json({ error: 'Coin data not found' });
        }

        // Responding with the coin data
        res.json({
            price: data[0].price,
            marketCap: data[0].marketCap,
            change24h: data[0].change24h,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Handler for calculating standard deviation
const getDeviation = async (req, res) => {
    const coin = req.query.coin; // Getting the coin from query params
    if (!coin) {
        return res.status(400).json({ error: 'Coin parameter is required' });
    }

    try {
        // Fetching the last 100 records for the requested coin
        const data = await CryptoData.find({ coin: coin })
            .sort({ timestamp: -1 }) // Sorting by timestamp to get the most recent records first
            .limit(100);

        if (data.length === 0) {
            return res.status(404).json({ error: 'No data found for the given coin' });
        }

        const prices = data.map(item => item.price);

        // Calculating the mean price
        const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;

        // Calculating the standard deviation
        const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
        const standardDeviation = Math.sqrt(variance);

        res.json({ deviation: standardDeviation });
    } catch (error) {
        console.error('Error calculating deviation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { homeRoute, getStats, getDeviation };
