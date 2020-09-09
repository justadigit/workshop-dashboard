const Role = require('../models/Role');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
  let errors = { email: '', password: '' };

  //incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered!';
  }

  //incorrect email
  if (err.message === 'incorrect password') {
    errors.password = 'password is incorrect!';
  }

  if (err.code == 11000) {
    //duplicated Error
    errors.email = 'That email had already registered!';
    return errors;
  }

  //validation error
  if (err.message.includes('User validation failed')) {
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
  let roles = [];
  Role.find()
    .then((data) => {
      if (data.length > 0) {
        res.render('auth/signup', { title: 'SignUp', roles: data });
      } else {
        res.render('auth/signup', { title: 'SignUp', roles: ['customer'] });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  const role = req.body.role;
  console.log(role);
  try {
    const newuser = await User.create({ email, password, role });
    const token = createToken(newuser._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: newuser._id });
  } catch (err) {
    let errors = handleError(err);
    res.status(400).json({ errors });
  }
};
