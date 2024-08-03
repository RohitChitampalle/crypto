const axios = require('axios');
 const handleGetCoins = async (req, res) => {
    try {
        // Define the API endpoint and API key for authorization
        const url = 'https://api.coinranking.com/v2/coins';
        

        // Make an HTTP GET request to the Coinranking API
        const response = await axios.get(url);

        // If successful, return a 200 status code with the response data
        return res.status(200).json(response.data);
    } catch (error) {
        // If there's an error, log it and return a 500 status code with an error message
        console.error('Error fetching data:', error.message);
        return res.status(500).json({ message: 'Failed to fetch data', error: error.message });
    }
};

module.exports={handleGetCoins}



