'use strict'

module.exports = allRoutes;

function allRoutes(app) {
  app.get('/', function (req, res) {
    res.render(path.resolve('viewws/index.html'), {},
    function (err, html) {
      if (err) {
        res.status(500).send('Internal Error');
        return;
      }
      res.send(html);
    });
  });
  app.get('*',
    function (req, res) {
      logs.debug('Intended to load %s', req.originalUrl);
      res.redirect('/');
  });
  app.post('/generate', require('./postNewLink.js'));
  app.get('/:mini', require('./getFullLink.js'));
}
