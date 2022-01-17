const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.get('/sauces/:id', sauceCtrl.getOneSauce);
router.get('/sauces', sauceCtrl.getAllSauces);

module.exports = router;