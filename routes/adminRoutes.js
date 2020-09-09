const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('backend/dashboard', { title: 'Dashboard', active: 'dashboard' });
});
router.get('/advisor', (req, res) => {
  res.render('backend/advisor', { title: 'Advisor', active: 'advisor' });
});
router.get('/workers', (req, res) => {
  res.render('backend/workers', { title: 'Workers', active: 'workers' });
});
router.get('/adminteam', (req, res) => {
  res.render('backend/adminteam', { title: 'Adminteam', active: 'adminteam' });
});

//for role
router.get('/role', authController.get_role);
router.post('/role', authController.post_role);

//for authentication
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

//for singup
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
module.exports = router;
