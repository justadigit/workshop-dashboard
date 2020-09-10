const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  res.render('backend/dashboard', { title: 'Dashboard', active: 'dashboard' });
});
router.get('/services', requireAuth, (req, res) => {
  res.render('backend/services', { title: 'Services', active: 'services' });
});
router.get('/customers', requireAuth, (req, res) => {
  res.render('backend/customers', { title: 'Customers', active: 'customers' });
});
router.get('/employee', requireAuth, (req, res) => {
  res.render('backend/employee', { title: 'Employee', active: 'employee' });
});
router.get('/investory', requireAuth, (req, res) => {
  res.render('backend/investory', { title: 'Investory', active: 'investory' });
});
router.get('/casher', requireAuth, (req, res) => {
  res.render('backend/casher', { title: 'Casher', active: 'casher' });
});

//for role
router.get('/role', requireAuth, authController.get_role);
router.post('/role', requireAuth, authController.post_role);

//for authentication
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

//for singup
router.get('/signup', requireAuth, authController.signup_get);
router.post('/signup', requireAuth, authController.signup_post);

//for logout
router.get('/logout', requireAuth, authController.logout_get);
module.exports = router;
