const express = require('express');
const CryptoData = require('../models/CryptoData');

const router = express.Router();
const { homeRoute, getStats, getDeviation } = require('../controller/cryptoController')

// Routes

router.get('/', homeRoute);
router.get('/stats', getStats);
router.get('/deviation', getDeviation);


module.exports = router;
