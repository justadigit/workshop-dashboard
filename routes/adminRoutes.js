const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/workshop-admin', requireAuth, (req, res) => {
  res.render('backend/dashboard', { title: 'Dashboard', active: 'dashboard' });
});
router.get('/workshop-admin/services', requireAuth, (req, res) => {
  res.render('backend/services', { title: 'Services', active: 'services' });
});
router.get('/workshop-admin/customers', requireAuth, (req, res) => {
  res.render('backend/customers', { title: 'Customers', active: 'customers' });
});
router.get('/workshop-admin/employee', requireAuth, (req, res) => {
  res.render('backend/employee', { title: 'Employee', active: 'employee' });
});
router.get('/workshop-admin/investory', requireAuth, (req, res) => {
  res.render('backend/investory', { title: 'Investory', active: 'investory' });
});
router.get('/workshop-admin/casher', requireAuth, (req, res) => {
  res.render('backend/casher', { title: 'Casher', active: 'casher' });
});

//for role
router.get('/workshop-admin/role', requireAuth, authController.get_role);
router.post('/workshop-admin/role', requireAuth, authController.post_role);

//for authentication
router.get('/workshop-admin/login', authController.login_get);
router.post('/workshop-admin/login', authController.login_post);

//for singup
router.get('/workshop-admin/signup', requireAuth, authController.signup_get);
router.post('/workshop-admin/signup', requireAuth, authController.signup_post);

//for logout
router.get('/workshop-admin/logout', requireAuth, authController.logout_get);

module.exports = router;
