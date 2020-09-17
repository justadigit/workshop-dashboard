const serviceController = require('../controllers/serviceController');
const express = require('express');
const router = express.Router();

router.get('/services', serviceController.service_get);

module.exports = router;
