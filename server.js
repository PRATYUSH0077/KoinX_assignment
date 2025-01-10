const app = require('./src/app');
const fetchCryptoData = require('./src/jobs/fetchCryptoData');

// Server configuration 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

setInterval(fetchCryptoData, 2 * 60 * 60 * 1000); // Runs every 2 hours

// to showcase the functionality of deviation(task-3), I rank thr fetchCryptoData() initially at an interval of 2 seconds.
