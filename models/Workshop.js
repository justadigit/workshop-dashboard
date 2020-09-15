const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Employee = require('./Employee');
const workshopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Fill your WorkShop Name!'],
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
    default: 'workshopadmin',
  },
});

//fire a function after doc saved to db
// userSchema.post('save', (doc, next) => {
//   console.log(`New user is created and saved`, doc);
//   next();
// });

//fire a function before doc saved
workshopSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//fire login function
workshopSchema.statics.login = async function (phone, password) {
  const user = await Workshop.findOne({ phone });
  const cashier = await Employee.findOne({ phone });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return { id: user._id, name: user.name, role: user.role };
    }
    throw Error('incorrect password');
  } else if (cashier) {
    const auth = await bcrypt.compare(password, cashier.password);
    if (auth) {
      let workshopname = [];
      Employee.findOne(cashier._id)
        .populate('workshopID')
        .select('name')
        .then(async function (data) {
          workshopname.push(data.workshopID.name);
          console.log(workshopname);
        });

      if (workshopname != []) {
        console.log(workshopname);
        return {
          id: cashier._id,
          name: workshopname[0],
          role: cashier.role,
        };
      }
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect phone number');
};

const Workshop = mongoose.model('Workshop', workshopSchema);
module.exports = Workshop;
