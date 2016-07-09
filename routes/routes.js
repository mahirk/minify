'use strict'

var path = require('path');
var passport = require('passport');
var authRoutesMiddleware = require('./authRoutes.js');

module.exports = allRoutes;

function allRoutes(app) {
  app.get('/cp', authRoutesMiddleware.redirAuth);
  app.post('/cp/login', function(req, res, next) {
    if (req.body.username && req.body.password) {
      next();
    } else {
      res.status(401).send();
    }
  },passport.authenticate('local', {
    successRedirect: '/cp',
    failureRedirect: '/cp#incorrect'
  }));
  app.post('/generate', authRoutesMiddleware.checkAuth, require('./postNewLink.js'));
  app.get('/:mini', require('./getFullLink.js'));
  app.get('/cp/all', require('./getAllLinks.js'));
  app.get('/', function(req, res) {
    res.redirect('/cp');
  });
}
