const express = require('express');

const cors = require('cors');
const apiCoinsRoute = require('./src/routes/coinRoute')
const app = express();
const PORT = 8001; // You can change the port number if needed

app.use(cors());

app.use('/get/api/', apiCoinsRoute)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
