const jwt = require('jsonwebtoken');
const Workshop = require('../models/Workshop');

const requireAuth = async function (req, res, next) {
  const token = req.cookies.workshopjwt;

  //check json web token exists and is verified
  if (token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/workshop-admin/login');
      } else {
        const user = await Workshop.findById(decodedToken.id);
        res.locals.workshopuser = user;
        next();
      }
    });
  } else {
    res.redirect('/workshop-admin/login');
  }
};
//check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.workshopjwt;
  if (token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await Workshop.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

//check workshopadmin
const checkAdmin = function (req, res, next) {
  console.log(res.locals.workshopuser);
  if (res.locals.workshopuser.role !== 'workshopadmin') {
    res.json('Not Allowed!');
  }
  next();
};

module.exports = { requireAuth, checkUser, checkAdmin };
