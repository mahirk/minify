var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var morgan   = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
require('./general/CallError.js');
require('./general/determineErr.js');
require('./general/log.js');


// ENV Variables

process.title = 'Minify Router';
var port = process.env.PORT || 8010;

// Router
module.exports = startExpress;  // get an instance of the express Router
global.app = startExpress();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers',
    'Accept,Content-Type,Authorization,Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

function startExpress() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.set('views', 'views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(express.static(path.join(__dirname, '/views')));
  createRoutes(app);
}

function createRoutes(app){
  activateRoute(app, './route/routes.js');
  logs.info('ALL ROUTES LOADED');
}

function activateRoute(app, routeFile) {
  logs.debug('Loading route file: ' + routeFile);
  require(routeFile)(app);
  startRedis(app);
}

function startRedis(app) {
  app.listen(port);
  logs.debug('Magic happens on port', port);
}

app.all('/', function (req, res) {
    res.status(200).json({
      status: 'OK',
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      cookies: req.cookies
    });
});


// Start Server
