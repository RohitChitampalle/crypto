const express = require('express');

const router = express.Router();

const {handleGetCoins} = require('../controller/coinController')

router.get('/coins',handleGetCoins)

module.exports = router