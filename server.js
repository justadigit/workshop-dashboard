const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const adminRouter = require('./routes/adminRoutes');
const { checkUser } = require('./middleware/authMiddleware');
const morgan = require('morgan');

// middleware
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
app.use('/workshop-admin', adminRouter);
