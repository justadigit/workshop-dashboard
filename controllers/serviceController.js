const Service = require('../models/Service');
module.exports.service_get = (req, res) => {
  res.render('backend/services', { title: 'Services', active: 'services' });
};
module.exports.service_post = (req, res) => {
  const { name, description, price, workshopID } = req.body;
  // console.log(req.body);
  const service = new Service({
    name,
    description,
    price,
    workshopID,
  });
  service
    .save()
    .then((data) => {
      res.status(201).json({ name: data.name });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
