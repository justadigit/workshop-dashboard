const express = require('express');
const suauthController = require('../controllers/suauthController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// for super admin
router.get('/superadmin/register', suauthController.register_get);
router.post('/superadmin/register', suauthController.register_post);
module.exports = router;
