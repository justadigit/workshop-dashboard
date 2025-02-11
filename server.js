const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const adminRouter = require('./routes/adminRoutes');
const suadminRouter = require('./routes/suadminRoutes');
const { checkUser } = require('./middleware/authMiddleware');
const morgan = require('morgan');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI =
  'mongodb+srv://naywin:naywin23@cluster0-urly7.mongodb.net/workshop?retryWrites=true&w=majority';
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log('Db Connect');
    app.listen(process.env.PORT || 2345);
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res, next) => {
  res.render('frontend/home');
});
app.use('/', adminRouter);
app.use('/', suadminRouter);
app.use('/workshop-admin/', require('./routes/serviceRoutes'));
//routes//api
app.use('/workshop/api', require('./api/routes/serviceRoute'));
