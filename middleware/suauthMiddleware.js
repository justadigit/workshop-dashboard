const jwt = require('jsonwebtoken');
const Workshop = require('../models/Workshop');

const requireAuth = async function (req, res, next) {
  const token = req.cookies.jwt;

  //check json web token exists and is verified
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/workshop-admin/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/workshop-admin/login');
  }
};
//check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await WorkShop.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
