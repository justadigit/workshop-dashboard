const Service = require('../../models/Service');
const jwt = require('jsonwebtoken');
const Workshop = require('../../models/Workshop');
const Employee = require('../../models/Employee');
module.exports.service_get = (req, res, next) => {
  Service.find({}).then(async (data) => {
    const token = req.cookies.workshopjwt;
    //check json web token exists and is verified
    if (token) {
      jwt.verify(token, 'secret', async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
        } else {
          const admin = await Workshop.findById(decodedToken.id);
          const cashier = await Employee.findById(decodedToken.id);
          if (admin) {
            if (data.length > 0) {
              let tservices = data.filter((service) => {
                return admin._id.toString() === service.workshopID.toString();
              });
              res.status(200).json({ services: tservices });
            } else {
              res.status(200).json({ message: 'No Data Yet' });
            }
          } else if (cashier) {
            if (data.length > 0) {
              let services = data.filter(async (service) => {
                return cashier.workshopID === service.workshopID;
              });
              res.status(200).json({ services: services });
            } else {
              res.status(200).json({ message: 'No Data Yet' });
            }
          }
        }
      });
    }
  });
};
