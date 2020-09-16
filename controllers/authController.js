const Role = require('../models/Role');
const User = require('../models/Employee');
const jwt = require('jsonwebtoken');
const Workshop = require('../models/Workshop');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

//get all roles
module.exports.get_role = (req, res, next) => {
  Role.find()
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(200).json({ message: 'Not Data Yet!' });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
module.exports.post_role = async (req, res, next) => {
  try {
    const newrole = await Role.create(req.body);
    res.status(200).json(newrole._id);
  } catch (err) {
    res.status(500).json(err);
  }
};

//handling Error
const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { phone: '', password: '' };

  //incorrect email
  if (err.message === 'incorrect email') {
    errors.phone = 'That email is not registered!';
  }

  //incorrect phone number
  if (err.message === 'incorrect phone number') {
    errors.phone = 'That phone Number is not registered!';
  }

  //incorrect email
  if (err.message === 'incorrect password') {
    errors.password = 'password is incorrect!';
  }

  if (err.code == 11000) {
    //duplicated Error
    errors.phone = 'That User had already registered!';
    return errors;
  }

  //validation error
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  //validation error
  if (err.message.includes('Workshop validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  //validation error
  if (err.message.includes('Employee validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  console.log(errors);
  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge,
  });
};

//signup
module.exports.signup_get = (req, res, next) => {
  res.render('auth/signup', { title: 'SignUp', active: 'dashboard' });
};

module.exports.signup_post = async (req, res) => {
  const { name, phone, password, workshopID, role } = await req.body;
  const employee = new Employee({
    name,
    phone,
    password,
    role,
    workshopID,
  });
  employee
    .save()
    .then((data) => {
      res.status(201).json({ user: data._id });
    })
    .catch((err) => {
      const errors = handleError(err);
      res.status(400).json({ errors });
    });
};

//login
module.exports.login_get = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};
module.exports.login_post = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const { id, name, role } = await Workshop.login(phone, password);
    const idtoken = createToken(id);
    res.cookie('workshopjwt', idtoken, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.cookie('workshopname', name, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ workshop: role });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};
module.exports.logout_get = async (req, res) => {
  res.cookie('workshopjwt', '', { maxAge: 1 });
  res.cookie('workshopname', '', { maxAge: 1 });
  res.redirect('/');
};
