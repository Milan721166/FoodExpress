const express = require('express');
const router = express.Router();
const { getAllResturant, createNewResturant } = require('../controllers/resturantController');

router.get('/', getAllResturant);
router.post('/addResturant', createNewResturant);

module.exports = router;