/**
* Mahir Kothary
* http://mahirk.com
* Copyright 2016
* GNU License
**/

// Load all the reqs
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var morgan   = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redis = require('redis');
var passport = require('passport');
// global app reqs
require('./general/log.js');
require('./general/CallError.js');
require('./general/determineErr.js');


// ENV Variables
process.title = 'Minify Router';
var port = process.env.PORT || 8010;
var redisUrl = process.env.REDIS_URL || 6379;

// Router
module.exports = startExpress;  // get an instance of the express Router
global.app = startExpress();

global.client;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers',
    'Accept,Content-Type,Authorization,Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

function startExpress() {
  logs.info('Starting', process.title);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.set('views', './views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  loadAuthentication(app);
  createRoutes(app);
  app.use(express.static(path.join(__dirname, 'views')));
}

function loadAuthentication(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  require('./general/AuthStrategy.js')();
}

function createRoutes(app){
  activateRoute(app, './routes/routes.js');
  logs.info('ALL ROUTES LOADED');
}

function activateRoute(app, routeFile) {
  logs.debug('Loading route file: ' + routeFile);
  require(routeFile)(app);
  startRedis(app);
}

function startRedis(app) {
  global.client = redis.createClient(redisUrl);
  client.on('error', function (err) {
    logs.error('Unable to load redis');
  });
  // Start Server
  client.on('ready', function (err) {
    logs.info('Redis Connected!');
    app.listen(port);
    logs.debug('Magic happens on port', port);
  });
}
