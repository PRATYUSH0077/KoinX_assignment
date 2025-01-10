const express = require('express');
const CryptoData = require('../models/CryptoData');

const router = express.Router();
const { homeRoute, getStats } = require('../controller/cryptoController')

// Routes

router.get('/', homeRoute);
router.get('/stats', getStats);
module.exports = router;
