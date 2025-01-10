const app = require('./src/app');
const fetchCryptoData = require('./src/jobs/fetchCryptoData');

// Server configuration 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// fetchCryptoData();
setInterval(fetchCryptoData, 2 * 60 * 60 * 1000); // Runs every 2 hours
