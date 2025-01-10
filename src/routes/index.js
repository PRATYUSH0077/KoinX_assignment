const express = require('express');
const CryptoData = require('../models/CryptoData');

const router = express.Router();

// Rendering the webpage according to the route set by me
router.get('/', async (req, res) => {
    try {
        const latestData = await CryptoData.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: { _id: '$coin', data: { $first: '$$ROOT' } } },
        ]);

        res.render('index', { coins: latestData });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
