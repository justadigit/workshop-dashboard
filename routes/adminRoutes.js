const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/workshop-admin', requireAuth, checkAdmin, (req, res) => {
  res.render('backend/dashboard', { title: 'Dashboard', active: 'dashboard' });
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
router.get('/workshop-admin/cashier', requireAuth, (req, res) => {
  res.render('backend/cashier', { title: 'Cashier', active: 'cashier' });
});

//for authentication
router.get('/workshop-admin/login', authController.login_get);
router.post('/workshop-admin/login', authController.login_post);

//for singup
router.get(
  '/workshop-admin/signup',
  requireAuth,
  checkAdmin,
  authController.signup_get
);
router.post(
  '/workshop-admin/signup',
  requireAuth,
  checkAdmin,
  authController.signup_post
);

//for logout
router.get('/workshop-admin/logout', requireAuth, authController.logout_get);

module.exports = router;
