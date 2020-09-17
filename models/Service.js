const mongoose = require('mongoose');
const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    default: 'not fix price',
  },
  workshopID: {
    ref: 'Workshop',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
