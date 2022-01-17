const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.post('/sauces', sauceCtrl.getAllSauces);

module.exports = router;