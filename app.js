var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://humeurdetweets:3BCbQNP5stAwDZLw@cluster0-shard-00-00-grg0y.mongodb.net:27017,cluster0-shard-00-01-grg0y.mongodb.net:27017,cluster0-shard-00-02-grg0y.mongodb.net:27017/twitterdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

var index = require('./routes/index');
var users = require('./routes/users');
var tweets = require('./routes/tweets');
var fichiers = require('./routes/fichiers');

var app = express();

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'twitter.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/tweets', tweets);
app.use('/fichiers', fichiers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.post('/page', function (req, res) {
  calling.aFunction();
  res.send('A message!');
});

module.exports = app;

