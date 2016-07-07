'use strict';


var async = require('async');
var _ = require('underscore');

var self = getAllLinks;
module.exports = self;

function getAllLinks(req, res, callback) {
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
      getKeys_.bind(null, sack),
      getResults_.bind(null, sack),
      createOutput_.bind(null, sack)
    ],
    function(err) {
      if(err){
        return throwErr(res, err);
      }
    }
  );
}

function checkInput_(sack, next) {
  var method = self.name + ' | '+ checkInput_.name;
  logs.debug('In', method);

  if(!sack.req)
    return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));

  next();
}

function getKeys_(sack, next) {
  var method = self.name + ' | '+ getKeys_.name;
  logs.debug('In', method);
  global.client.keys(*, function (err, keys) {
    if (err) {
      return next(new CallErr(method, CallErr.DBOperationFailed, 'Could not access Redis'));
    } else if (!keys) {
      logs.info('no keys found');
      next();
    } else {
      sack.keys = keys;
      next();
    }
  });
}

function getResults_(sack, next) {
  var method = self.name + ' | '+ getResults_.name;
  logs.debug('In', method);
  sack.getOp = global.client.multi();
  _.each(sack.keys, function(key) {
    sack.getOp.get(key);
  });
  sack.getOp.exec(function(err, result){
    if (err) {
      return next(new CallErr(method, CallErr.OperationFailed, 'Unable to set a new ID'));
    } else {
      logs.debug('Successfully got all links');
      sack.result = result;
      next();
    }
  });
}

function createOutput_() {
  var method = self.name + ' | '+ createOutput_.name;
  logs.debug('In', method);
  
}
