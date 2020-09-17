const serviceController = require('../controllers/serviceController');
const { requireAuth, checkAdmin } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/services', requireAuth, checkAdmin, serviceController.service_get);
router.post(
  '/services',
  requireAuth,
  checkAdmin,
  serviceController.service_post
);
module.exports = router;
