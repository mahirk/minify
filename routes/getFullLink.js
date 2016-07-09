'use strict';

var self = getFullLink;
module.exports = self;

var async = require('async');

function getFullLink(req, res) {
  logs.info('Applying', self.name);

  var sack = {
    req: req,
    headers: req.headers,
    params: req.params,
    resBody: [],
    resStatus: 102  // PROCESSING
  }

  async.series([
      checkInput_.bind(null, sack),
      formOutput_.bind(null, sack),
      incrementAccessCount_.bind(null, sack)
    ],
    function(err) {
      if(err){
        return throwErr(res, err);
      }
      logs.info('Finished', self.name)
      if (sack.resStatus === 404) {
        return res.status(404).render('404', {url: '/' + sack.params.mini});
      }

      return res.redirect(sack.resBody);
    }
  );

}

function checkInput_(sack, next) {
  var method = self.name + ' | '+ checkInput_.name;
  logs.debug('In', method);

  if(!sack.req)
    return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));

  if(!sack.params)
    return next(new CallErr(method, CallErr.ParamNotFound, 'No param found'));

  global.client.select(0, function(err, intr) {
    if(err) {
      return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));
    }
    next();
  });
}

function formOutput_(sack, next) {
  var method = self.name + ' | '+ formOutput_.name;
  logs.debug('In', method);
  logs.debug('Finding id', sack.params.mini);
  var id = sack.params.mini + '_url';
  global.client.get(id, function(err, redirectObject) {
    if (err) {
      logs.error('Error finding id', sack.params.mini);
      return next(err);
    } else if(!redirectObject) {
      logs.error('ID %s was not found.', id);
      sack.resStatus = 404;
      return next();
    } else {
      sack.resStatus = 200;
      sack.resBody = redirectObject;
      sack.success = true;
      next();
    }
  });
}

function incrementAccessCount_(sack, next) {
  var method = self.name + ' | '+ incrementAccessCount_.name;
  logs.debug('In', method);
  if (!sack.success) {
    return next();
  }
  var id = sack.params.mini + '_hits';
  global.client.incr(id, function(err, data) {
    if (err) {
      logs.error('Error incrementing id', sack.params.mini);
      return next();
    } else {
      logs.debug('Incremented %s', id);
      next();
    }
  });
}
