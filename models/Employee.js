const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Fill Name Field!'],
  },
  phone: {
    type: String,
    required: [true, 'Phone Number Field is required!'],
    unique: true,
    minlength: [7, 'Minimum Number length is 7 Integer!'],
  },
  password: {
    type: String,
    required: [true, 'Password Field is required!'],
    minlength: [6, 'Minimum password length is 6 characters!'],
  },
  role: {
    type: String,
    default: 'worker',
  },
  workshopID: {
    ref: 'Workshop',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

//fire a function after doc saved to db
// userSchema.post('save', (doc, next) => {
//   console.log(`New user is created and saved`, doc);
//   next();
// });

//fire a function before doc saved
employeeSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//fire login function
employeeSchema.statics.login = async function (phone, password) {
  const user = await Employee.findOne({ phone });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect phone');
};

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
