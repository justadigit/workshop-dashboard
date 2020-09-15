const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
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
        const admin = await Workshop.findById(decodedToken.id);
        const cashier = await Employee.findById(decodedToken.id);
        if (admin) {
          res.locals.user = admin;
          res.locals.workshopname = req.cookies.workshopname;
          next();
        } else if (cashier) {
          res.locals.user = cashier;
          res.locals.workshopname = req.cookies.workshopname;
          next();
        }
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
        res.locals.workshopname = null;
        next();
      } else {
        const admin = await Workshop.findById(decodedToken.id);
        const cashier = await Employee.findById(decodedToken.id);
        if (admin) {
          res.locals.user = admin;
          res.locals.workshopname = req.cookies.workshopname;
          next();
        } else {
          res.locals.user = cashier;
          res.locals.workshopname = req.cookies.workshopname;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    res.locals.workshopname = null;
    next();
  }
};

//check workshopadmin
const checkAdmin = function (req, res, next) {
  console.log(res.locals.user);
  if (res.locals.user.role !== 'workshopadmin') {
    res.json('Not Allowed!');
  }
  next();
};

module.exports = { requireAuth, checkUser, checkAdmin };
