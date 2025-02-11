const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});
const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
