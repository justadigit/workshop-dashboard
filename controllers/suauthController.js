const jwt = require('jsonwebtoken');
const Workshop = require('../models/Workshop');

//handling Error
const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { phone: '', password: '' };

  //incorrect email
  if (err.message === 'incorrect phone number') {
    errors.phone = 'That phone number is not registered!';
  }

  //incorrect email
  if (err.message === 'incorrect password') {
    errors.password = 'password is incorrect!';
  }

  if (err.code == 11000) {
    //duplicated Error
    errors.phone = 'That phone number had already registered!';
    return errors;
  }

  //validation error
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  console.log(errors);
  //validation error
  if (err.message.includes('Workshop validation failed')) {
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
//register
module.exports.register_get = async (req, res, next) => {
  res.render('auth/register', { title: 'Register' });
};

module.exports.register_post = async (req, res, next) => {
  const { name, phone, password } = req.body;
  try {
    const workshop = await Workshop.create({ name, phone, password });
    const token = createToken(workshop._id);
    res.cookie('workshopjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.cookie('workshopname', name, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ workshop: workshop._id });
  } catch (err) {
    let errors = handleError(err);
    res.status(400).json({ errors });
  }
};
