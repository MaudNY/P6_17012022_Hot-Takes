const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');

router.post('/sauce', multer, sauceCtrl.createSauce)
router.get('/sauces/:id', sauceCtrl.getOneSauce);
router.get('/sauces', sauceCtrl.getAllSauces);

module.exports = router;