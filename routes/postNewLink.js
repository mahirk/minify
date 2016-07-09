'use strict';

var async = require('async');
var util = require('util');

var self = postNewLink;
module.exports = self;

function postNewLink(req, res) {
  logs.info('Applying', self.name);

  var sack = {
    req: req,
    headers: req.headers,
    body: req.body,
    resBody: [],
    resStatus: 102  // PROCESSING
  }

  async.series([
      checkInput_.bind(null, sack),
      checkDBforKey_.bind(null, sack),
      saveToRedis_.bind(null, sack),
      formOutput_.bind(null, sack)
    ],
    function(err) {
      if(err){
        return throwErr(res, err);
      }
      logs.info('Finished', self.name)
      if (sack.resStatus === 200) {
        return res.redirect('/cp');
      }
      return res.status(sack.resStatus).send(sack.resBody);
    }
  );

}

function checkInput_(sack, next) {
  var method = self.name + ' | '+ checkInput_.name;
  logs.debug('In', method);

  if (!sack.req)
    return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));

  if (!sack.body || !(sack.body.url && sack.body.mini))
    return next(new CallErr(method, CallErr.DataNotFound, 'No body found'));

  if (sack.body.mini === 'cp' || sack.body.mini === 'generate')
    return next(new CallErr(method, CallErr.InvalidParam, 'Admin is a reserved name'));

  global.client.select(0, function(err, intr) {
    if(err) {
      return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));
    }
    next();
  });
}

function checkDBforKey_(sack, next) {
  var method = self.name + ' | '+ checkDBforKey_.name;
  logs.debug('In', method);
  global.client.exists(sack.body.mini, function(err, value) {
    sack.valid = value;
    next();
  });
}

function saveToRedis_(sack, next) {
  var method = self.name + ' | '+ saveToRedis_.name;
  logs.debug('In', method);
  // ensures key is not present
  if (sack.valid > 0) {
    return next(new CallErr(method, CallErr.InvalidParam, 'Name already in use'));
  }
  // continues PROCESSING
  var url = util.format('%s_%s', sack.body.mini, 'url');
  var hits = util.format('%s_%s', sack.body.mini, 'hits');
  var setOp = global.client.multi();
  setOp.set(url, sack.body.url);
  setOp.set(hits, 0);
  setOp.exec(function(err, result){
    if (err) {
      return next(new CallErr(method, CallErr.OperationFailed, 'Unable to set a new ID'));
    } else {
      logs.debug('Successfully created new id');
      sack.result = result;
      next();
    }
  });
}

function formOutput_(sack, next) {
  var method = self.name + ' | '+ formOutput_.name;
  logs.debug('In', method);
  sack.resStatus = 200;
  sack.resBody.push(sack.result);
  next();
}
