'use strict'

var path = require('path');
var authRoutesMiddleware = require('./authRoutes.js');

module.exports = allRoutes;

function allRoutes(app) {
  app.get('/cp', authRoutesMiddleware.redirAuth);
  app.post('/cp/login', authRoutesMiddleware.authenticate);
  app.post('/generate', authRoutesMiddleware.checkAuth, require('./postNewLink.js'));
  app.get('/:mini', require('./getFullLink.js'));
}
