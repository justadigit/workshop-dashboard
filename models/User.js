const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email Field is required!'],
    unique: true,
    lowercase: [true, 'Email must be lowercase'],
    validate: [isEmail, 'Please Enter a valid Email!'],
  },
  password: {
    type: String,
    required: [true, 'Password Field is required!'],
    minlength: [6, 'Minimum password length is 6 characters!'],
  },
  role: {
    ref: 'Role',
    type: String,
    required: [true, 'Please check user role'],
  },
});

//fire a function after doc saved to db
// userSchema.post('save', (doc, next) => {
//   console.log(`New user is created and saved`, doc);
//   next();
// });

//fire a function before doc saved
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//fire login function
userSchema.statics.login = async function (email, password) {
  const user = await User.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('User', userSchema);
module.exports = User;
