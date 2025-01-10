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
        const data = await CryptoData.find({ coin: coin });
        // console.log(coin)
        // console.log(req.originalUrl)
        // console.log(data)
        if (!data) {
            return res.status(404).json({ error: 'Coin data not found' });
        }

        // Responding with the coin data

        res.json({
            price: data[0].price,
            marketCap: data[0].marketCap,
            change24h: data[0].change24h,
        });
        // res.json(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { homeRoute, getStats };
