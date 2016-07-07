'use strict';

var passport = require('passport');
var path = require('path');
var getAllLinks = require('./getAllLinks.js');
module.exports = authRoutesMiddleware;

var authRoutesMiddleware = {};

authRoutesMiddleware.redirAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    getAllLinks(req, res, function(err, links) {
      if (err) {
        return res.status(500).render(path.resolve('views/login'), {err: err});
      }
      return res.status(200).render(path.resolve('views/app/cp'), {links: links});
    });
  } else {
    return res.render(path.resolve('views/login'));
  }
};

authRoutesMiddleware.authenticate = passport.authenticate('local', {
  successRedirect: '/cp',
  failureRedirect: '/cp#incorrect'
});

authRoutesMiddleware.checkAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    logs.error('Unauthorized attempted to generate right');
    return res.render(path.resolve('views/login'));
  }
};
